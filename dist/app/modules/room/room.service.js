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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const room_constant_1 = require("./room.constant");
const redis_1 = require("../../../shared/redis");
const createRoom = (payload) => {
    const result = prisma_1.prisma.room.create({
        data: payload,
        include: {
            building: true,
        },
    });
    // PUBLISH ON REDIS
    if (result) {
        redis_1.RedisClient.publish(room_constant_1.EVENT_ROOM_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
};
const getSingleRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.room.findUnique({
        where: { id },
        include: {
            building: true,
        },
    });
    // RETURN
    return result;
});
// GET ALL
const getAllRooms = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // PAGINATION
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // QUERY BUILDER
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: room_constant_1.roomSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // console.log({ filtersData });
    // field Filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([field, value]) => {
                // FILTERING
                if (field === 'buildingId') {
                    return {
                        building: {
                            id: {
                                equals: value,
                            },
                        },
                    };
                }
                // FILTERING
                if (Array.isArray(value)) {
                    return {
                        [field]: {
                            in: value,
                        },
                    };
                }
                // DEFAULT
                return {
                    [field]: {
                        equals: value,
                    },
                };
            }),
        });
    }
    // BUILD QUERY
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.room.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            building: true,
        },
    });
    // GET TOTAL COUNT
    const total = yield prisma_1.prisma.room.count();
    // RETURN
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// UPDATE
const updateRoom = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF ROOM EXISTS
    const isExist = yield prisma_1.prisma.room.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.room.update({
        where: { id },
        data: payload,
        include: {
            building: true,
        },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        redis_1.RedisClient.publish(room_constant_1.EVENT_ROOM_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE
const deleteRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF ROOM EXISTS
    const isExist = yield prisma_1.prisma.room.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.room.delete({
        where: { id },
        include: {
            building: true,
        },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        redis_1.RedisClient.publish(room_constant_1.EVENT_ROOM_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT
exports.RoomService = {
    createRoom,
    getSingleRoom,
    getAllRooms,
    updateRoom,
    deleteRoom,
};
