import mongoose, { mongo } from 'mongoose';
import createLgger from '../logger';
import env from '../env'

const logger = createLgger('MongoDB');
const uri = `mongodb://${env.MONGO_USERNAME ? env.MONGO_USERNAME : ""}${env.MONGO_USERNAME ? ":" : ""}${env.MONGO_PASSWORD ? env.MONGO_PASSWORD : ""}${env.MONGO_USERNAME ? "@" : ""}localhost:27017/ebredebre`;
const db = mongoose.connection;



db.on('error', function (error) {
	logger.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
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

mongoose.connect(uri, { autoReconnect: false, useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection
export default connection