import * as winston from 'winston'

const dbFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} | [${label}] [${level}]: ${message}`;
});

function createLogger(label: string) {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.label({ label: label }),
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'HH:mm:ss'
            }),
            dbFormat
        ),
        transports: [new winston.transports.Console()]
    });
    return logger;
}


export default createLogger;