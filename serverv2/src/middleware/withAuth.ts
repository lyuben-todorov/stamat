import jwt from 'jsonwebtoken';
import createLogger from '../createLogger';
import env from '../env';
import { Request, Response } from 'express';
const secret = env.APP_SECRET;
const logger = createLogger("Auth middleware")
const withAuth = function (req: Request, res: Response, next: Function) {
        const token = req.cookies.token;
        if (!token) {
                logger.error("No token");
                res.status(401).send('Unauthorized: No token provided');
        } else {
                jwt.verify(token, secret, function (err: Error, decoded: string) {
                        if (err) {

                                logger.error("Invalid token");
                                res.status(401).send('Unauthorized: Invalid token');
                        } else {
                                next();
                        }
                });
        }
}
export default withAuth