import express from 'express';
import withAuth from '../middleware/withAuth';
var router = express.Router();


router.get('/checkToken',withAuth, function (req, res) {
        res.status(200).send("yeees");
});

export default router;