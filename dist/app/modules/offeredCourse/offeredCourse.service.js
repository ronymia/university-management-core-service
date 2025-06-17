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
exports.OfferedCourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const asyncForEach_1 = __importDefault(require("../../../shared/asyncForEach"));
const prisma_1 = require("../../../shared/prisma");
const offeredCourse_constant_1 = require("./offeredCourse.constant");
const redis_1 = require("../../../shared/redis");
// CREATE
const createOfferedCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseIds, academicDepartmentId, semesterRegistrationId } = payload;
    //   const createMany = await prisma.offeredCourse.createMany({
    //     data: courseIds.map(courseId => ({
    //       academicDepartmentId,
    //       semesterRegistrationId,
    //       courseId,
    //     })),
    //     skipDuplicates: true,
    //   });
    const result = [];
    yield (0, asyncForEach_1.default)(courseIds, (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const offeredCourseExists = yield prisma_1.prisma.offeredCourse.findFirst({
            where: {
                courseId,
                academicDepartmentId,
                semesterRegistrationId,
            },
        });
        // IF NIT EXIST THEN CREATE NEW
        if (!offeredCourseExists) {
            // CREATE
            const offeredCourse = yield prisma_1.prisma.offeredCourse.create({
                data: {
                    courseId,
                    academicDepartmentId,
                    semesterRegistrationId,
                },
                include: {
                    course: true,
                    academicDepartment: true,
                    semesterRegistration: true,
                },
            });
            // PUSH
            result.push(offeredCourse);
        }
    }));
    // PUBLISH ON REDIS
    if (result.length) {
        yield redis_1.RedisClient.publish(offeredCourse_constant_1.EVENT_OFFERED_COURSE_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// GET ALL
const getAllOfferedCourses = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andCondition = [];
    // SEARCH IN FIELD
    if (searchTerm) {
        andCondition.push({
            OR: offeredCourse_constant_1.offeredCourseSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.offeredCourse.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            course: true,
            academicDepartment: true,
            semesterRegistration: true,
        },
    });
    // TOTAL COUNT
    const total = yield prisma_1.prisma.offeredCourse.count({
        where: whereCondition,
    });
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.offeredCourse.count({
        where: whereCondition,
    });
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
const getSingleOfferedCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.offeredCourse.findUnique({
        where: { id },
        include: {
            course: true,
            academicDepartment: true,
            semesterRegistration: true,
        },
    });
    return result;
});
// UPDATE
const updateOfferedCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.offeredCourse.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    // UPDATE
    const result = yield prisma_1.prisma.offeredCourse.update({
        where: { id },
        data: payload,
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourse_constant_1.EVENT_OFFERED_COURSE_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE
const deleteOfferedCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.offeredCourse.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    // DELETE
    const result = yield prisma_1.prisma.offeredCourse.delete({
        where: { id },
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourse_constant_1.EVENT_OFFERED_COURSE_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT
exports.OfferedCourseService = {
    createOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
};
