  import redis from 'redis';
import createLgger from '../logger';

const logger = createLgger('Matchmaking Redis');
const redisClient = redis.createClient();
redisClient.on("error", function (err) {
        logger.error("Redis error: " + err);
});
redisClient.on("ready", () => {
        logger.info("Redis connection opened!")

});

export default redisClient;