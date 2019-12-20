import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectMongo from 'connect-mongo';
import session from 'express-session';

import mongoConnection from './mongo/mongoClient';
import indexRouter from './routes/index';
import userRouter from './routes/user';
import env from './env';

const app = express();
const MongoStore = connectMongo(session)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
    secret: env.APP_SECRET,
    store: new MongoStore({mongooseConnection: mongoConnection}),
    resave: false,
    cookie: {
        maxAge: 60000,
    },
    saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/user', userRouter)
export default app;