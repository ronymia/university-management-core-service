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
exports.StudentSemesterPaymentService = void 0;
const prisma_1 = require("../../../shared/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const studentSemesterPayment_constant_1 = require("./studentSemesterPayment.constant");
const redis_1 = require("../../../shared/redis");
// CREATE SEMESTER PAYMENT
const createSemesterPayment = (prismaClient, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const getSemesterPayment = yield prismaClient.studentSemesterPayment.findFirst({
        where: {
            studentId: payload.studentId,
            academicSemesterId: payload.academicSemesterId,
        },
    });
    if (!getSemesterPayment) {
        const paymentData = {
            studentId: payload.studentId,
            academicSemesterId: payload.academicSemesterId,
            fullPaymentAmount: payload.totalPaymentAmount,
            partialPaymentAmount: 0,
            totalDuePaymentAmount: payload.totalPaymentAmount,
            totalPaidPaymentAmount: 0,
        };
        yield prismaClient.studentSemesterPayment.create({
            data: paymentData,
        });
    }
});
// GET SINGLE SEMESTER PAYMENT
const getSingleSemesterPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.studentSemesterPayment.findUnique({
        where: { id },
    });
    if (!result) {
        throw new Error('Student semester payment not found');
    }
    // RETURN TO THE CONTROLLER
    return result;
});
// GET ALL SEMESTER PAYMENT
const getAllSemesterPayment = (filterRequest, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filterRequest, filtersData = __rest(filterRequest, ["searchTerm"]);
    // QUERY BUILDER
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: studentSemesterPayment_constant_1.studentSemesterPaymentSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.studentSemesterPayment.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
    });
    // GET TOTAL COUNT
    const total = yield prisma_1.prisma.studentSemesterPayment.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.studentSemesterPayment.count({
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
// UPDATE SEMESTER PAYMENT
const updatedSemesterPayment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT SEMESTER PAYMENT EXISTS
    const isExist = yield prisma_1.prisma.studentSemesterPayment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new Error('Student semester payment not found');
    }
    // UPDATE
    const updatedStudentSemesterPayment = yield prisma_1.prisma.studentSemesterPayment.update({
        where: { id },
        data: payload,
    });
    // PUBLISH ON REDIS
    if (updatedStudentSemesterPayment) {
        yield redis_1.RedisClient.publish(studentSemesterPayment_constant_1.EVENT_STUDENT_SEMESTER_PAYMENT_UPDATED, JSON.stringify(updatedStudentSemesterPayment));
    }
    // RETURN TO THE CONTROLLER
    return updatedStudentSemesterPayment;
});
// DELETE SEMESTER PAYMENT
const deleteSemesterPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT SEMESTER PAYMENT EXISTS
    const isExist = yield prisma_1.prisma.studentSemesterPayment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new Error('Student semester payment not found');
    }
    // DELETE
    const deletedStudentSemesterPayment = yield prisma_1.prisma.studentSemesterPayment.delete({
        where: { id },
    });
    // PUBLISH ON REDIS
    if (deletedStudentSemesterPayment) {
        yield redis_1.RedisClient.publish(studentSemesterPayment_constant_1.EVENT_STUDENT_SEMESTER_PAYMENT_DELETED, JSON.stringify(deletedStudentSemesterPayment));
    }
    // RETURN TO THE CONTROLLER
    return deletedStudentSemesterPayment;
});
// EXPORT
exports.StudentSemesterPaymentService = {
    createSemesterPayment,
    getSingleSemesterPayment,
    getAllSemesterPayment,
    updatedSemesterPayment,
    deleteSemesterPayment,
};
