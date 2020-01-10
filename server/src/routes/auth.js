import express from 'express';
import createLogger from '../logger';
import jwt from 'jsonwebtoken'
import User from '../mongo/models/User'
import env from '../env';
import { loggers } from 'winston';
const secret = env.APP_SECRET;
const logger = createLogger("User Authentication");
var router = express.Router();
/* GET home page. */


router.post('/register', (req, res) => {
        const { email, password,username } = req.body;

        const user = new User({ email, password,username });
        user.save(function (err) {
                if (err) {

                        logger.error(err)
                        res.status(409)
                                .send({emailError:true});
                } else {
                        logger.info("Registered user: " + email);
                        res.status(200).send("Welcome to the club!");
                }
        });
});




router.post('/login',  (req, res) => {
        const { email, password } = req.body;
        User.findOne({ email }, function (err, user) {
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
                                        const payload = { email };
                                        const token = jwt.sign(payload, secret, {
                                                expiresIn: '1h'
                                        });
                                        res
                                        .cookie('token', token, { httpOnly: true,maxAge:360000 }).send( )
                                        console.log(user)
                                }
                        });
                }
        });
});
router.get('/logout', (req,res) => {
        res.clearCookie('token').sendStatus(200);
})
export default router;