"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const createLogger_1 = __importDefault(require("../createLogger"));
const env_1 = __importDefault(require("../env"));
const logger = createLogger_1.default('MongoDB');
const uri = `mongodb://${env_1.default.MONGO_USERNAME ? env_1.default.MONGO_USERNAME : ""}${env_1.default.MONGO_USERNAME ? ":" : ""}${env_1.default.MONGO_PASSWORD ? env_1.default.MONGO_PASSWORD : ""}${env_1.default.MONGO_USERNAME ? "@" : ""}localhost:27017/ebredebre`;
mongoose_1.default.set('useCreateIndex', true);
const db = mongoose_1.default.connection;
db.on('error', function (error) {
    logger.error('Error in MongoDb connection: ' + error);
    mongoose_1.default.disconnect();
});
db.once('open', function () {
    logger.info('MongoDB connection opened!');
});
db.on('reconnected', function () {
    logger.info('Established MongoDB connection!');
});
db.on('disconnected', function () {
    logger.info('MongoDB disconnected!');
});
mongoose_1.default.connect(uri, { autoReconnect: false, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose_1.default.connection;
exports.default = connection;
//# sourceMappingURL=mongoClient.js.map