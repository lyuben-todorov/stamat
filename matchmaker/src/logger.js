import winston, { format, } from 'winston';
const { label, printf } = format;

const dbFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} | [${label}] [${level}]: ${message}`;
});
function createLogger(label){
        const logger = winston.createLogger({
                level: 'info',
                format: format.combine(
                        format.label({ label: label }),
                        format.colorize(),
                        format.timestamp({
                                format: 'HH:mm:ss'
                        }),
                        dbFormat
                ),
                transports: [new winston.transports.Console()]
        });
        return logger;
}


export default createLogger;