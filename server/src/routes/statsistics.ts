import express from 'express';
import redisClient from '../redis/redisClient';
var router = express.Router();
/* GET home page. */

router.get('/currentInfo', function (req, res) {
});
router.get('/gamesInfo', (req, res) => {

})

export default router;