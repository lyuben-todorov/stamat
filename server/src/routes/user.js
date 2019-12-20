import express from 'express';
import createLogger from '../logger';
import jwt from 'jsonwebtoken'
import User from '../mongo/models/User'
import env from '../env';
const secret = env.APP_SECRET;
const logger = createLogger("User Authentication");
var router = express.Router();
/* GET home page. */

router.post('/register', function (req, res) {
        const { email, password } = req.body;
        const user = new User({ email, password });
        user.save(function (err) {
                if (err) {
                        res.status(500)
                                .send("Error registering new user please try again.");
                } else {
                        logger.info("Registered user: " + email);
                        res.status(200).send("Welcome to the club!");
                }
        });
});


router.post('/login', function (req, res) {
        const { email, password } = req.body;
        User.findOne({ email }, function (err, user) {
                if (err) {
                        logger.error(err);
                        res.status(500).json({
                                error: 'Internal error please try again'
                        });
                } else if (!user) {
                        res.status(401)
                                .json({
                                        error: 'Incorrect email or password'
                                }).send();
                } else {
                        user.isCorrectPassword(password, (err, same) => {
                                if (err) {
                                        res.status(500)
                                                .json({
                                                        error: 'Internal error please try again'
                                                });
                                } else if (!same) {
                                        res.status(401)
                                                .json({
                                                        error: 'Incorrect email or password'
                                                });
                                } else {
                                        // Issue token
                                        const payload = { email };
                                        const token = jwt.sign(payload, secret, {
                                                expiresIn: '1h'
                                        });
                                        logger.info("Logged in user:" + email + " With token: " + token)
                                        res.cookie('token', token, { httpOnly: true })
                                                .sendStatus(200);
                                }
                        });
                }
        });
});
export default router;