"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("../config"));
const logger_1 = require("./logger");
const redisClient = (0, redis_1.createClient)({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});
const redisPubClient = (0, redis_1.createClient)({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});
const redisSubClient = (0, redis_1.createClient)({
    // url: config.redis.url
    // password: process.env.REDIS_PASSWORD,
    username: 'default',
    password: 'ClYsS2MuKXp7su0HBbjlRGOZ3HbxzzOP',
    socket: {
        host: 'redis-10221.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10221,
    },
});
redisClient.on('connect', () => {
    logger_1.logger.info('Redis client connected');
});
redisClient.on('error', err => {
    logger_1.errorLogger.error('Redis client error', err);
});
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
    yield redisPubClient.connect();
    yield redisSubClient.connect();
});
const set = (key, value, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(key, value, options);
});
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redisClient.get(key);
});
const del = (key) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.get(key);
});
const setAccessToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    const expireTime = Number(config_1.default.redis.expires_in);
    yield redisClient.set(key, token, { EX: expireTime });
});
const getAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    return yield redisClient.get(key);
});
const delAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    yield redisClient.del(key);
});
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.quit();
    yield redisPubClient.quit();
    yield redisSubClient.quit();
});
exports.RedisClient = {
    set,
    get,
    del,
    connect,
    disconnect,
    setAccessToken,
    getAccessToken,
    delAccessToken,
    publish: redisPubClient.publish.bind(redisPubClient),
    subscribe: redisSubClient.subscribe.bind(redisSubClient),
    client: redisClient,
};
