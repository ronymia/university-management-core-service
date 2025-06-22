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
exports.OfferedCourseSectionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const offeredCourseSection_constant_1 = require("./offeredCourseSection.constant");
const offerredCourseClassSchedule_utils_1 = require("../offeredCourseClassSchedule/offerredCourseClassSchedule.utils");
const asyncForEach_1 = __importDefault(require("../../../shared/asyncForEach"));
const redis_1 = require("../../../shared/redis");
// CREATE
const createOfferedCourseSection = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { classSchedules: classSchedulesPayload } = payload, offeredCourseSectionPayload = __rest(payload, ["classSchedules"]);
    // CHECK IF OFFERED COURSE EXISTS
    const getOfferedCourse = yield prisma_1.prisma.offeredCourse.findFirst({
        where: {
            id: offeredCourseSectionPayload.offeredCourseId,
        },
    });
    if (!getOfferedCourse) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Offered course not found with ID ${offeredCourseSectionPayload.offeredCourseId}`);
    }
    const getOfferedCourseSection = yield prisma_1.prisma.offeredCourseSection.findFirst({
        where: {
            semesterRegistrationId: getOfferedCourse.semesterRegistrationId,
            title: offeredCourseSectionPayload.title,
        },
    });
    if (getOfferedCourseSection) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `Section already exists with ${getOfferedCourseSection.title}`);
    }
    yield (0, asyncForEach_1.default)(classSchedulesPayload, (schedule) => __awaiter(void 0, void 0, void 0, function* () {
        yield offerredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkAvailableRoom(schedule);
        yield offerredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkAvailableFaculty(schedule);
    }));
    const createdSection = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CHECK AVAILABLE ROOM AND FACULTY
        // CREATE OFFERED COURSE SECTION
        const createdOfferedCourseSection = yield transactionClient.offeredCourseSection.create({
            data: Object.assign(Object.assign({}, offeredCourseSectionPayload), { semesterRegistrationId: getOfferedCourse.semesterRegistrationId }),
        });
        // CREATE CLASS SCHEDULES
        const scheduleData = classSchedulesPayload.map((schedule) => (Object.assign(Object.assign({}, schedule), { offeredCourseSectionId: createdOfferedCourseSection.id, semesterRegistrationId: getOfferedCourse.semesterRegistrationId })));
        yield transactionClient.offeredCourseClassSchedule.createMany({
            data: scheduleData,
        });
        return createdOfferedCourseSection;
    }));
    // PUBLISH ON REDIS
    // if (createdSection) {
    //   await RedisClient.publish(
    //     EVENT_OFFERED_COURSE_SECTION_CREATED,
    //     JSON.stringify(createdSection)
    //   );
    // }
    // RETURN
    return createdSection;
});
// GET ALL
const getAllOfferedCourseSections = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andCondition = [];
    // SEARCH IN FIELD
    if (searchTerm) {
        andCondition.push({
            OR: offeredCourseSection_constant_1.offeredCourseSectionSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.offeredCourseSection.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            offeredCourse: {
                include: {
                    course: true,
                    academicDepartment: true,
                },
            },
            semesterRegistration: {
                include: {
                    academicSemester: true,
                    offeredCourseClassSchedules: true,
                },
            },
        },
    });
    // TOTAL COUNT
    const total = yield prisma_1.prisma.offeredCourseSection.count({
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
const getSingleOfferedCourseSection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.offeredCourseSection.findUnique({
        where: { id },
        include: {
            offeredCourse: true,
            semesterRegistration: true,
            offeredCourseClassSchedules: true,
        },
    });
    return result;
});
// UPDATE
const updateOfferedCourseSection = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { classSchedules } = payload, courseSection = __rest(payload, ["classSchedules"]);
    console.log({ classSchedules, courseSection });
    const isExist = yield prisma_1.prisma.offeredCourseSection.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    const updateSectionAndSchedules = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // UPDATE COURSE SECTION
        const updatedSection = yield transactionClient.offeredCourseSection.update({
            where: { id },
            data: courseSection,
        });
        // UPDATE CLASS SCHEDULE
        yield (0, asyncForEach_1.default)(classSchedules, (schedule) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.offeredCourseClassSchedule.update({
                where: { id: schedule.id },
                data: schedule,
            });
        }));
        return updatedSection;
    }));
    // PUBLISH ON REDIS
    // if (result) {
    //   await RedisClient.publish(
    //     EVENT_OFFERED_COURSE_SECTION_UPDATED,
    //     JSON.stringify(result)
    //   );
    // }
    // RETURN
    return updateSectionAndSchedules;
});
// DELETE
const deleteOfferedCourseSection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.offeredCourseSection.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, `Invalid ID ${id}`);
    }
    // DELETE
    const result = yield prisma_1.prisma.offeredCourseSection.delete({
        where: { id },
    });
    // PUBLISH ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(offeredCourseSection_constant_1.EVENT_OFFERED_COURSE_SECTION_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT
exports.OfferedCourseSectionServices = {
    createOfferedCourseSection,
    getAllOfferedCourseSections,
    getSingleOfferedCourseSection,
    updateOfferedCourseSection,
    deleteOfferedCourseSection,
};
