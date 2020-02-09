import redis from 'ioredis';
import createLgger from '../createLogger';

const logger = createLgger('Server Redis');
const redisClient = new redis();

redisClient.on("error", function (err) {
        logger.error("Redis error: " + err);
});
redisClient.on("ready", () => {
        logger.info("Redis connection opened!")

});

export default redisClient;