"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const createLogger_1 = __importDefault(require("../createLogger"));
const logger = createLogger_1.default('Server Redis');
const redisClient = new ioredis_1.default();
redisClient.on("error", function (err) {
    logger.error("Redis error: " + err);
});
redisClient.on("ready", () => {
    logger.info("Redis connection opened!");
});
exports.default = redisClient;
//# sourceMappingURL=redisClient.js.map