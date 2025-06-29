"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// const createToken = (
//   payload: any,
//   secret: Secret,
//   expireTime: string
// ): string => {
//   return jwt.sign(payload, secret as Secret, {
//     expiresIn: expireTime,
//   });
// };
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Your token has expired');
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid JWT token');
        }
        else {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token verification failed');
        }
    }
};
exports.jwtHelpers = {
    // createToken,
    verifyToken,
};
