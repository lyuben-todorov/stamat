"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createLogger_1 = __importDefault(require("../createLogger"));
const env_1 = __importDefault(require("../env"));
const secret = env_1.default.APP_SECRET;
const logger = createLogger_1.default("Auth middleware");
const withAuth = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        logger.error("No token");
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
            if (err) {
                logger.error("Invalid token");
                res.status(401).send('Unauthorized: Invalid token');
            }
            else {
                next();
            }
        });
    }
};
exports.default = withAuth;
//# sourceMappingURL=withAuth.js.map