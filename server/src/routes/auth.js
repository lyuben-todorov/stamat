import express from 'express';
import createLogger from '../logger';
import jwt, { decode } from 'jsonwebtoken'
import User from '../mongo/models/User'
import env from '../env';
import { loggers } from 'winston';
import redisClient from '../redis/redisClient';
const secret = env.APP_SECRET;
const logger = createLogger("User Authentication");
var router = express.Router();
/* GET home page. */



router.post('/register', (req, res) => {
        const { email, password, username } = req.body;

        const user = new User({ email: email, password: password, username: username });

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



// used to restore user session
// client sends request with auth cookies
// if the token is valid the server tries to retrieve session 
// if there is a session the cookie session is sent
// otherwise a new session is generated
// sessions are redis-instance specific as they don't get persisted to static storage (mongodb)

// note: this is only used to restore the token itself. Data such as game state is restored on it's own through sockets.
router.get('/restore', (req, res) => {

        const token = req.cookies.token;
        if (!token) {
                logger.error("No token");
                res.status(401).send('Unauthorized: No token provided');
        } else {
                jwt.verify(token, secret, function (err, decoded) {
                        if (err) {

                                logger.error("Invalid token");
                                res.status(401).send('Unauthorized: Invalid token');
                        } else {
                                let { email } = decoded;

                                User.findOne({ email }, (err, user) => {
                                        let { email, username } = user;

                                        redisClient.get(user._id.toString(), (err, reply) => {
                                                let sessionId = reply;

                                                //no session for user found
                                                if (!reply) {
                                                        // make new session id
                                                        sessionId = jwt.sign({ username }, secret);
                                                        redisClient.set(user._id.toString(), sessionId);
                                                }
                                                res.cookie('sessionId', sessionId)
                                                        .send({ email, username, sessionId });
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
                        user.comparePassword(password, function (err, isMatch) {
                                if (err) {
                                        res.status(500)
                                                .json({
                                                        error: 'Internal error please try again'
                                                });
                                } else if (!isMatch) {
                                        res.status(401).send('wrong creds');
                                } else {
                                        // Issue token
                                        const token = jwt.sign({
                                                email:user.email
                                        }, secret);

                                        let { email, username } = user;

                                        redisClient.get(user._id.toString(), (err, reply) => {
                                                let sessionId

                                                if (reply) {
                                                        sessionId = reply
                                                } else {
                                                        sessionId = jwt.sign({ username }, secret);
                                                        redisClient.set(user._id.toString(), sessionId);
                                                }
                                                res.cookie('token', token, { httpOnly: true })
                                                        .cookie('sessionId', sessionId)
                                                        .send({ email, username, sessionId });
                                                // we send the sessionid as it is useless without the securely-issued token cookie anyway
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