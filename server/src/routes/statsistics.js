import express from 'express';
import redisClient from '../redis/redisClient';
var router = express.Router();
/* GET home page. */

router.get('/currentInfo', function (req, res) {
});
router.get('/gamesInfo', (req, res) => {
    redisClient.keys("*object", (err, reply) => {
        let gameObjectArray = [];

        redisClient.mget(reply, (err, arrayReply) => {
            if (arrayReply) {

                arrayReply.forEach(element => {
                    let parsedObject = JSON.parse(element);
                    gameObjectArray.push(parsedObject);
                });
            }
            res.send(gameObjectArray);
        })
    })
})

export default router;