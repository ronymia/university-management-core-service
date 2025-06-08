"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (error) => {
    console.log({ handleValidationError: error.message });
    const statusCode = http_status_1.default.BAD_REQUEST;
    // const message = error.message;
    const message = error.message.trim().split('\n');
    const errors = [
        {
            path: '',
            message: message[message.length - 1],
        },
    ];
    return {
        statusCode,
        message: message[message.length - 1],
        errorMessages: errors,
    };
};
exports.default = handleValidationError;
