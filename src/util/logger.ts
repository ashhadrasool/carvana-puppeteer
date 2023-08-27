import winston from 'winston';

const logLevels = {
    info: 0,
    error: 1,
    debug: 2,
};

interface LoggerOptions {
    logErrorTraces?: boolean;
    loggerPrefixSpacing?: number
}

function createLogger(loggerOptions?: LoggerOptions) {
    return winston.createLogger({

        levels: logLevels,
        level: 'error',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({
                timestamp, level, message, stack,
            }) => {
                if (message.constructor === Object || message.constructor === Array) {
                    message = JSON.stringify(message, null, 4);
                }
                const levelPadded = level.padEnd(17);
                const text = `[${timestamp}] ${levelPadded}: ${message}`;
                if ((loggerOptions && loggerOptions.logErrorTraces === false) || stack === undefined) {
                    return text;
                }
                return `${text}\n${stack}`;
            }),
        ),
        transports: [new winston.transports.Console()],
    });
}

export { createLogger };
