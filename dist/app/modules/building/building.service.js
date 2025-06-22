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
exports.BuildingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const building_constant_1 = require("./building.constant");
const redis_1 = require("../../../shared/redis");
// CREATE BUILD
const createBuilding = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.building.create({
        data: payload,
    });
    if (result) {
        yield redis_1.RedisClient.publish(building_constant_1.EVENT_BUILDING_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// GET BY ID
const getSingleBuilding = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.building.findUnique({
        where: { id },
    });
    //  RETURN
    return result;
});
// GET ALL
const getAllBuildings = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: building_constant_1.buildingSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // field Filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    // BUILD QUERY
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.building.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            rooms: true,
        },
    });
    // GET TOTAL COUNT
    const total = yield prisma_1.prisma.building.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = result === null || result === void 0 ? void 0 : result.length;
    const totalPages = Math.ceil(total / limit);
    // RETURN
    return {
        meta: {
            page,
            limit,
            skip,
            total,
            totalPages,
            paginationTotal,
        },
        data: result,
    };
});
// UPDATE
const updateBuilding = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF BUILDING EXISTS
    const isExist = yield prisma_1.prisma.building.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Building not found');
    }
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.building.update({
        where: { id },
        data: payload,
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(building_constant_1.EVENT_BUILDING_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE
const deleteBuilding = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF BUILDING EXISTS
    const isExist = yield prisma_1.prisma.building.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Building not found');
    }
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.building.delete({
        where: { id },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(building_constant_1.EVENT_BUILDING_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT SERVICES
exports.BuildingService = {
    createBuilding,
    getSingleBuilding,
    getAllBuildings,
    updateBuilding,
    deleteBuilding,
};
