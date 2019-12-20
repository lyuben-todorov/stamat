import express from 'express';

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
            res.status(200).send("Welcome to the club!");
        }
    });
});
export default router;