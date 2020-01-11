import jwt from 'jsonwebtoken';
import createLogger from '../logger';
import env from '../env';
const secret = env.APP_SECRET;
const logger = createLogger("Auth middleware")
const withAuth = function (req, res, next) {
        const token = req.cookies.token;
        if (!token) {
                logger.error("No token");
                res.status(401).send('Unauthorized: No token provided');
        } else {
                jwt.verify(token, secret, function (err, decoded) {
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