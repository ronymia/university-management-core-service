"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, label, printf } = winston_1.format;
// Format for log entries
const loggerFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${date.toDateString()} ${hours}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
});
// ✅ Writable log directory for serverless environments
// const baseLogPath = path.join('/tmp', 'logs', 'winston');
const baseLogPath = path_1.default.join(process.cwd(), 'logs', 'winston');
// Ensure log subdirectories exist
['successes', 'errors'].forEach(dir => {
    const fullPath = path_1.default.join(baseLogPath, dir);
    if (!fs_1.default.existsSync(fullPath)) {
        fs_1.default.mkdirSync(fullPath, { recursive: true });
    }
});
// Info logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'UMS Core Service' }), timestamp(), loggerFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.DailyRotateFile({
            level: 'info',
            filename: path_1.default.join(baseLogPath, 'successes', '%DATE%success.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
        }),
    ],
});
exports.logger = logger;
// Error logger
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'UMS Auth Service' }), timestamp(), loggerFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.DailyRotateFile({
            level: 'error',
            filename: path_1.default.join(baseLogPath, 'errors', '%DATE%error.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '1d',
        }),
    ],
});
exports.errorLogger = errorLogger;
