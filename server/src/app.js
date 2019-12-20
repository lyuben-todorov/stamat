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

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
        if (req.cookies.user_sid && !req.session.user) {
                res.clearCookie('user_sid');
        }
        next();
});

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/user', userRouter)
export default app;