import express from 'express';
var router = express.Router();
import redisClient from '../redis/redisClient'

/* GET home page. */
router.get('/', function (req, res, next) {
        redisClient.get('key',(err,_res)=>{
                res.send(_res);
        });
});
export default router;