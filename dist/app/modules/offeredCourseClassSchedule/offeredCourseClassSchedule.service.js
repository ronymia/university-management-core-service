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
exports.OfferedCourseClassScheduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const offeredCourseClassSchedule_constant_1 = require("./offeredCourseClassSchedule.constant");
const offerredCourseClassSchedule_utils_1 = require("./offerredCourseClassSchedule.utils");
const redis_1 = require("../../../shared/redis");
// CREATE
const createOfferedCourseClassSchedule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield offerredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkAvailableRoom(payload);
    yield offerredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkAvailableFaculty(payload);
    // CREATE
    const result = yield prisma_1.prisma.offeredCourseClassSchedule.create({
        data: payload,
        include: {
            room: true,
            faculty: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourseClassSchedule_constant_1.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// GET ALL
const getAllOfferedCourseClassSchedules = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andCondition = [];
    // SEARCH IN FIELD
    if (searchTerm) {
        andCondition.push({
            OR: offeredCourseClassSchedule_constant_1.offeredCourseClassScheduleSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // FILTERING
    if (Object.keys(filtersData).length) {
        andCondition.push({
            AND: Object.entries(filtersData).map(([field, value]) => {
                // Convert minCredit/maxCredit to number
                // Keep status/code/startDate/endDate as-is
                return { [field]: value };
            }),
        });
    }
    // QUERY
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.offeredCourseClassSchedule.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            faculty: true,
            room: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    // TOTAL COUNT
    const total = yield prisma_1.prisma.offeredCourseClassSchedule.count({
        where: whereCondition,
    });
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = result === null || result === void 0 ? void 0 : result.length;
    const totalPages = Math.ceil(total / limit);
    // RETURN
    return {
        data: result,
        meta: {
            page,
            limit,
            skip,
            total,
            totalPages,
            paginationTotal,
        },
    };
});
// GET BY ID
const getSingleOfferedCourseClassSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.offeredCourseClassSchedule.findUnique({
        where: { id },
        include: {
            faculty: true,
            room: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    return result;
});
// UPDATE
const updateOfferedCourseClassSchedule = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.offeredCourseClassSchedule.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    // UPDATE
    const result = yield prisma_1.prisma.offeredCourseClassSchedule.update({
        where: { id },
        data: payload,
        include: {
            faculty: true,
            room: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourseClassSchedule_constant_1.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE
const deleteOfferedCourseClassSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.offeredCourseClassSchedule.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    // DELETE
    const result = yield prisma_1.prisma.offeredCourseClassSchedule.delete({
        where: { id },
        include: {
            faculty: true,
            room: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourseClassSchedule_constant_1.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT
exports.OfferedCourseClassScheduleServices = {
    createOfferedCourseClassSchedule,
    getAllOfferedCourseClassSchedules,
    getSingleOfferedCourseClassSchedule,
    updateOfferedCourseClassSchedule,
    deleteOfferedCourseClassSchedule,
};
