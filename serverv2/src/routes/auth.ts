import express from 'express';
import createLogger from '../createLogger';
import jwt from 'jsonwebtoken'
import User, { IUser } from '../mongo/models/User'
import env from '../env';
import redisClient from '../redis/redisClient';
import { UserSession } from '../socketio/models/sessions/UserSession';
const secret = env.APP_SECRET;
const logger = createLogger("User Authentication");
var router = express.Router();
/* GET home page. */



router.post('/register', (req, res) => {
    const { email, password, username } = req.body;

    const user: IUser = new User({
        email: email,
        password: password,
        username: username,
    });

    user.save(function (err) {
        if (err) {

            logger.error(err)
            res.status(409)
                .send({ emailError: true });
        } else {
            logger.info("Registered user: " + email);
            res.status(200).send("Welcome to the club!");
        }
    });
});



// used to restore user session through auth token
// client sends request with auth cookies
// if the token is valid the server tries to retrieve session 
// if there is a session the cookie session is sent
// otherwise a new session is generated
// sessions are redis-instance specific as they don't get persisted to static storage (mongodb)

// note: this is only used to restore the token itself. Data such as game state is restored on it's own through sockets.
router.get('/restore', (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err: Error, decoded: IUser) {
            if (err) {

                logger.error("Invalid token");
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                var { email } = decoded;

                User.findOne({ email }, (err, user) => {
                    var { email, username, _id } = user;

                    redisClient.get(_id, (err, sessionId) => {
                        redisClient.get(sessionId, (err, serializedSessionObject) => {
                            console.log(serializedSessionObject)
                            if (!sessionId || serializedSessionObject == null) {
                                // make new session id
                                sessionId = jwt.sign({ username }, secret);
                                // this SET is for the auth cycle
                                redisClient.set(user._id.toString(), sessionId);


                                var sessionObject: UserSession = {
                                    sessionId: sessionId,

                                    username: user.username,
                                    email: user.email,
                                    
                                    inMatch: false,
                                    connected: true,
                                    
                                    matchIds: [],

                                    // user settings
                                    autoAccept: true,
                                }
                                var serializedSessionObject = JSON.stringify(sessionObject);
                                redisClient.set(sessionId, serializedSessionObject, (err, res) => {
                                    if (!err) {
                                        logger.info(`Session persisted successfully: ${sessionId.slice(-5)}`);

                                    } else {
                                        logger.error(`Error persisting session ${sessionId.slice(-5)}: ${err}`)
                                    }
                                })
                                res.cookie('sessionId', sessionId)
                                    .send(sessionObject);
                            } else {
                                redisClient.get(sessionId, (err, serializedSessionObject) => {
                                    console.log(sessionId);
                                    var sessionObject: UserSession = JSON.parse(serializedSessionObject);
                                    res.cookie('sessionId', sessionObject.sessionId).send(sessionObject);
                                })
                            }
                        })
                        //no session for user found


                    })
                });
            }
        });
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            user.comparePassword(password, function (err: Error, isMatch: boolean) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!isMatch) {
                    res.status(401).send('Wrong credentials');
                } else {
                    // Issue token
                    const token = jwt.sign({
                        email: user.email
                    }, secret);


                    const { email, username, _id } = user;
                    const id = _id.toString()
                    redisClient.get(id, (err, reply) => {
                        var sessionId: string

                        if (reply) {
                            sessionId = reply
                        } else {
                            sessionId = jwt.sign({ username }, secret);
                            // this SET is for the auth cycle
                            redisClient.set(id, sessionId);

                            var sessionObject: UserSession = {
                                sessionId: sessionId,

                                username: user.username,
                                email: user.email,

                                
                                inMatch: false,
                                connected: true,
                                
                                matchIds: [],

                                //user settings
                                autoAccept: true

                            }

                            const stringifiedSessionObject = JSON.stringify(sessionObject);
                            redisClient.set(sessionId, stringifiedSessionObject, (err, res) => {
                                if (!err) {
                                    logger.info(`Session persisted successfully: ${sessionId.slice(-5)}`);

                                } else {
                                    logger.error(`Error persisting session ${sessionId.slice(-5)}: ${err}`)
                                }
                            })
                        }
                        res.cookie('token', token, { httpOnly: true })
                            .cookie('sessionId', sessionId)
                            .send(sessionObject);
                        // we send the sessionid as it is useless without the  auth issued token cookie anyway
                    });
                }
            });
        }
    });
});
router.get('/logout', (req, res) => {
    res.clearCookie('token').clearCookie('sessionId').sendStatus(200);
})
export default router;