"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleClientKnownRequestError = (error) => {
    // console.log({
    //   handleClientKnownRequestError: error.meta,
    // });
    const statusCode = http_status_1.default.UNPROCESSABLE_ENTITY;
    const messages = error.message.trim().split('\n');
    const message = messages[messages.length - 1];
    const match = message.match(/\(`(.*?)`\)/);
    const field = match ? match[1] : null;
    const errors = [
        {
            path: field || '',
            message: 'A record with the same value already exists.',
        },
    ];
    return {
        statusCode,
        message: messages[message.length - 1],
        errorMessages: errors,
    };
};
exports.default = handleClientKnownRequestError;
