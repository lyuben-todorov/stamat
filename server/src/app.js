import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import cors from 'cors';
import mongoConnection from './mongo/mongoClient';
import indexRouter from './routes/index';
import userRouter from './routes/auth';
import env from './env';

const app = express();
const MongoStore = connectMongo(session)
const PORT = env.PORT || 5000;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session middleware
app.use(session({
        secret: env.APP_SECRET,
        store: new MongoStore({ mongooseConnection: mongoConnection }),
        resave: false,
        cookie: {
                maxAge: 60000,
        },
        saveUninitialized: false
}))



app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/auth', userRouter)

app.listen(PORT, () => console.log(`Listening on ${PORT}`));