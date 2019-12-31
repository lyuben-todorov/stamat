import express from 'express';
import withAuth from '../middleware/withAuth';
import redisClient from '../redis/redisClient'
var router = express.Router();

router.get('/', withAuth, function (req, res) {
    res.status(200).send("yeees");
});

export default router;