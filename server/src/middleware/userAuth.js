import jwt from 'jsonwebtoken'
import createLogger from '../logger';
const logger = createLogger("Auth middleware")
const withAuth = function (req, res, next) {
        const token = req.cookies.token;
        logger.info(req.cookies.token);
        if (!token) {
                res.status(401).send('Unauthorized: No token provided');
        } else {
                jwt.verify(token, secret, function (err, decoded) {
                        if (err) {
                                res.status(401).send('Unauthorized: Invalid token');
                        } else {
                                req.email = decoded.email;
                                next();
                        }
                });
        }
}
export default withAuth