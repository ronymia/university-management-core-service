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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseService = void 0;
const prisma_1 = require("../../../shared/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const studentEnrolledCourse_constant_1 = require("./studentEnrolledCourse.constant");
const redis_1 = require("../../../shared/redis");
const createStudentEnrolledCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
    const isExist = yield prisma_1.prisma.studentEnrolledCourse.findUnique({
        where: { id: payload.id },
    });
    if (isExist) {
        throw new Error('Student enrolled course already exists');
    }
    // CREATE
    const createdStudentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.create({
        data: payload,
    });
    if (!createdStudentEnrolledCourse) {
        throw new Error('Failed to create student enrolled course');
    }
    // PUBLISH ON REDIS
    if (createdStudentEnrolledCourse) {
        yield redis_1.RedisClient.publish(studentEnrolledCourse_constant_1.EVENT_STUDENT_ENROLLED_COURSE_CREATED, JSON.stringify(createdStudentEnrolledCourse));
    }
    // RETURN TO THE CONTROLLER
    return createdStudentEnrolledCourse;
});
// GET SINGLE STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const studentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.findUnique({
        where: { id },
    });
    if (!studentEnrolledCourse) {
        throw new Error('Student enrolled course not found');
    }
    // RETURN TO THE CONTROLLER
    return studentEnrolledCourse;
});
// GET ALL STUDENT ENROLLED COURSE
const getAllStudentEnrolledCourse = (filterRequest, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filterRequest, filtersData = __rest(filterRequest, ["searchTerm"]);
    // QUERY BUILDER
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: studentEnrolledCourse_constant_1.studentEnrolledCourseSearchableFields.map(field => ({
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
    const whereCondition = andConditions.length ? { AND: andConditions } : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
    });
    // GET TOTAL COUNT
    const total = yield prisma_1.prisma.studentEnrolledCourse.count();
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
const updateStudentEnrolledCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
    const isExist = yield prisma_1.prisma.studentEnrolledCourse.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new Error('Student enrolled course not found');
    }
    // UPDATE
    const updatedStudentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.update({
        where: { id },
        data: payload,
    });
    // PUBLISH ON REDIS
    if (updatedStudentEnrolledCourse) {
        yield redis_1.RedisClient.publish(studentEnrolledCourse_constant_1.EVENT_STUDENT_ENROLLED_COURSE_UPDATED, JSON.stringify(updatedStudentEnrolledCourse));
    }
    // RETURN TO THE CONTROLLER
    return updatedStudentEnrolledCourse;
});
// DELETE
const deleteStudentEnrolledCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
    const isExist = yield prisma_1.prisma.studentEnrolledCourse.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new Error('Student enrolled course not found');
    }
    // DELETE
    const deletedStudentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.delete({
        where: { id },
    });
    // PUBLISH ON REDIS
    if (deletedStudentEnrolledCourse) {
        yield redis_1.RedisClient.publish(studentEnrolledCourse_constant_1.EVENT_STUDENT_ENROLLED_COURSE_DELETED, JSON.stringify(deletedStudentEnrolledCourse));
    }
    // RETURN TO THE CONTROLLER
    return deletedStudentEnrolledCourse;
});
// EXPORTING THE SERVICE
exports.StudentEnrolledCourseService = {
    createStudentEnrolledCourse,
    getSingleStudentEnrolledCourse,
    getAllStudentEnrolledCourse,
    updateStudentEnrolledCourse,
    deleteStudentEnrolledCourse,
};
