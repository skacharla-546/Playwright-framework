import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, scope }) => {
        const tag = scope ? `[${scope}] ` : '';
        return `${timestamp} ${level}: ${tag}${message}`;
    }),
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

const rootLogger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    defaultMeta: { service: 'ttacart-tests' },
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            format: fileFormat,
            maxsize: 5_242_880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5_242_880,
            maxFiles: 5,
        }),
    ],
});

rootLogger.exceptions.handle(
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
);

rootLogger.rejections.handle(
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') }),
);

/** Returns a child logger tagged with [scope] in every log line. */
export function getLogger(scope: string): winston.Logger {
    return rootLogger.child({ scope });
}

export default rootLogger;
