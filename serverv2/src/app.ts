import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan'
import redisClient from './redis/redisClient'

import mongoClient from './mongo/mongoClient';
import indexRouter from './routes/index';
import userRouter from './routes/auth';
import statsticsRouter from './routes/statsistics'
import _ from 'lodash';


const app = express();




mongoClient.startSession();
//middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan('dev'))

// Routes
app.use('/', indexRouter);
app.use('/auth', userRouter);
app.use('/statistics', statsticsRouter);

redisClient.set("mmqueue", 0);
redisClient.del("matchmaking_queue");

export default app
