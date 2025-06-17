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
exports.CourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const course_constant_1 = require("./course.constant");
const redis_1 = require("../../../shared/redis");
// CREATE
const createCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = payload, courseData = __rest(payload, ["preRequisiteCourses"]);
    const newCourse = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE COURSE
        const createdCourse = yield transactionClient.course.create({
            data: courseData,
        });
        // CHECK IF COURSE IS CREATED
        if (!createdCourse) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create course');
        }
        // CREATE PRE REQUISITE COURSES
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            yield transactionClient.courseToPrerequisite.createMany({
                data: preRequisiteCourses.map((courseIds) => ({
                    courseId: createdCourse.id,
                    preRequisiteId: courseIds.courseId,
                })),
            });
        }
        // RETURN
        return createdCourse;
    }));
    if (newCourse) {
        const result = yield prisma_1.prisma.course.findUnique({
            where: {
                id: newCourse.id,
            },
            include: {
                preRequisite: {
                    include: {
                        preRequisite: true,
                    },
                },
                preRequisiteFor: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        // PUBLISH EVENT ON REDIS
        if (result) {
            yield redis_1.RedisClient.publish(course_constant_1.EVENT_COURSE_CREATED, JSON.stringify(result));
        }
        return result;
    }
    // RETURN
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create course');
});
const getAllCourse = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: course_constant_1.courseSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.course.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    // GET TOTAL COUNT
    const total = yield prisma_1.prisma.course.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.course.count({
        where: whereCondition,
    });
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
// GET BY ID SINGLE
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.course.findUnique({
        where: {
            id,
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    // RETURN
    return result;
});
// UPDATE
const updateCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = payload, courseData = __rest(payload, ["preRequisiteCourses"]);
    yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // UPDATE COURSE
        const updatedCourse = yield transactionClient.course.update({
            where: { id },
            data: courseData,
        });
        // CHECK IF COURSE IS UPDATED
        if (!updatedCourse) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create course');
        }
        // UPDATE PRE REQUISITE COURSES
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // DELETE
            const deletablePreRequisiteCourses = preRequisiteCourses.filter((preRequisite) => preRequisite.courseId && preRequisite.isDeleted);
            yield transactionClient.courseToPrerequisite.deleteMany({
                where: {
                    courseId: id,
                    preRequisiteId: {
                        in: deletablePreRequisiteCourses.map((preRequisite) => preRequisite.courseId),
                    },
                },
            });
            // CREATE
            const newPreRequisiteCourses = preRequisiteCourses.filter((preRequisite) => preRequisite.courseId && !preRequisite.isDeleted);
            yield transactionClient.courseToPrerequisite.createMany({
                data: newPreRequisiteCourses.map((preRequisite) => ({
                    courseId: id,
                    preRequisiteId: preRequisite.courseId,
                })),
            });
        }
    }));
    const result = yield prisma_1.prisma.course.findUnique({
        where: {
            id,
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    // RETURN
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create course');
    }
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(course_constant_1.EVENT_COURSE_UPDATED, JSON.stringify(result));
    }
    return result;
});
// DELETE
const deleteCourse = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF COURSE EXISTS
    const isExist = yield prisma_1.prisma.course.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    // DELETE COURSES
    const result = yield prisma_1.prisma.course.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(course_constant_1.EVENT_COURSE_DELETED, JSON.stringify(result));
    }
    return result;
});
// ASSIGN FACULTIES
const assignFaculties = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.courseFaculty.createMany({
        data: payload.map(facultyId => ({
            courseId: id,
            facultyId,
        })),
        skipDuplicates: true, // 🔥 Prevents error on duplicate (composite key)
    });
    const assignedFaculties = yield prisma_1.prisma.courseFaculty.findMany({
        where: {
            AND: [
                {
                    courseId: id,
                },
                {
                    facultyId: {
                        in: payload,
                    },
                },
            ],
        },
        include: {
            faculty: true,
        },
    });
    return assignedFaculties;
});
// REMOVE FACULTIES
const removeFaculties = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // REMOVE FACULTIES
    yield prisma_1.prisma.courseFaculty.deleteMany({
        where: {
            AND: [
                {
                    courseId: id,
                },
                {
                    facultyId: {
                        in: payload,
                    },
                },
            ],
        },
    });
    // GET ASSIGNED FACULTIES
    const assignedFaculties = yield prisma_1.prisma.courseFaculty.findMany({
        where: {
            AND: [
                {
                    courseId: id,
                },
            ],
        },
        include: {
            faculty: true,
        },
    });
    return assignedFaculties;
});
// EXPORT SERVICES
exports.CourseServices = {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    assignFaculties,
    removeFaculties,
};
