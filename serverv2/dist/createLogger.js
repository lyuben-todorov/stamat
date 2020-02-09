"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
const dbFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} | [${label}] [${level}]: ${message}`;
});
function createLogger(label) {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.label({ label: label }), winston.format.colorize(), winston.format.timestamp({
            format: 'HH:mm:ss'
        }), dbFormat),
        transports: [new winston.transports.Console()]
    });
    return logger;
}
exports.default = createLogger;
//# sourceMappingURL=createLogger.js.map