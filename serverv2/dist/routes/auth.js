"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createLogger_1 = __importDefault(require("../createLogger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../mongo/models/User"));
const env_1 = __importDefault(require("../env"));
const redisClient_1 = __importDefault(require("../redis/redisClient"));
const secret = env_1.default.APP_SECRET;
const logger = createLogger_1.default("User Authentication");
var router = express_1.default.Router();
/* GET home page. */
router.post('/register', (req, res) => {
    const { email, password, username } = req.body;
    const user = new User_1.default({ email: email, password: password, username: username });
    user.save(function (err) {
        if (err) {
            logger.error(err);
            res.status(409)
                .send({ emailError: true });
        }
        else {
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
    }
    else {
        jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
            if (err) {
                logger.error("Invalid token");
                res.status(401).send('Unauthorized: Invalid token');
            }
            else {
                let { email } = decoded;
                User_1.default.findOne({ email }, (err, user) => {
                    let { email, username, _id } = user;
                    redisClient_1.default.get(_id, (err, reply) => {
                        let sessionId = reply;
                        //no session for user found
                        if (!reply) {
                            // make new session id
                            sessionId = jsonwebtoken_1.default.sign({ username }, secret);
                            // this SET is for the auth cycle
                            redisClient_1.default.set(user._id.toString(), sessionId);
                            let sessionObject = {
                                sessionId: sessionId,
                                clientUsername: user.username,
                                gameId: "none",
                                opponentId: "none",
                                opponentName: "none"
                            };
                            console.log(sessionObject);
                            redisClient_1.default.hmset(sessionId, sessionObject, (err, res) => {
                                if (!err) {
                                    logger.info(`Session persisted successfully: ${sessionId.slice(-5)}`);
                                }
                                else {
                                    logger.error(`Error persisting session ${sessionId.slice(-5)}: ${err}`);
                                }
                            });
                        }
                        res.cookie('sessionId', sessionId)
                            .send({ email, username, _id, sessionId });
                    });
                });
            }
        });
    }
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User_1.default.findOne({ email }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                error: 'Internal error please try again'
            });
        }
        else if (!user) {
            res.status(401)
                .json({
                error: 'Incorrect email or password'
            });
        }
        else {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    res.status(500)
                        .json({
                        error: 'Internal error please try again'
                    });
                }
                else if (!isMatch) {
                    res.status(401).send('wrong creds');
                }
                else {
                    // Issue token
                    const token = jsonwebtoken_1.default.sign({
                        email: user.email
                    }, secret);
                    const { email, username, _id } = user;
                    const id = _id.toString();
                    redisClient_1.default.get(id, (err, reply) => {
                        var sessionId;
                        if (reply) {
                            sessionId = reply;
                        }
                        else {
                            sessionId = jsonwebtoken_1.default.sign({ username }, secret);
                            // this SET is for the auth cycle
                            redisClient_1.default.set(user._id.toString(), sessionId);
                            let sessionObject = {
                                sessionId: sessionId,
                                clientUsername: user.username,
                                gameId: "none",
                                opponentId: "none",
                                opponentName: "none"
                            };
                            redisClient_1.default.hmset(sessionId, sessionObject, (err, res) => {
                                if (!err) {
                                    logger.info(`Session persisted successfully: ${sessionId.slice(-5)}`);
                                }
                                else {
                                    logger.error(`Error persisting session ${sessionId.slice(-5)}: ${err}`);
                                }
                            });
                        }
                        res.cookie('token', token, { httpOnly: true })
                            .cookie('sessionId', sessionId)
                            .send({ email, username, id, sessionId });
                        // we send the sessionid as it is useless without the securely-issued token cookie anyway
                    });
                }
            });
        }
    });
});
router.get('/logout', (req, res) => {
    res.clearCookie('token').clearCookie('sessionId').sendStatus(200);
});
exports.default = router;
//# sourceMappingURL=auth.js.map