import redis from 'redis';
import logger from './redisLogger';
const redisClient = redis.createClient();

redisClient.on("error", function (err) {
        logger.error("Redis error: " + err);
});
redisClient.on("ready", () => {
        logger.info("Established redis connection!")

});

export default redisClient;