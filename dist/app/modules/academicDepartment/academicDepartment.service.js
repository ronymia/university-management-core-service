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
exports.AcademicDepartmentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const academicDepartment_constant_1 = require("./academicDepartment.constant");
const redis_1 = require("../../../shared/redis");
// CREATE ACADEMIC DEPARTMENT
const createAcademicDepartment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // VALIDATE ACADEMIC FACULTY ID EXISTS
    const facultyExists = yield prisma_1.prisma.academicFaculty.findUnique({
        where: { id: payload.academicFacultyId },
    });
    //
    if (!facultyExists) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, 'Invalid academicFacultyId');
    }
    // CREATE ACADEMIC DEPARTMENT
    const result = yield prisma_1.prisma.academicDepartment.create({
        data: payload,
        include: {
            academicFaculty: true,
        },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicDepartment_constant_1.EVENT_ACADEMIC_DEPARTMENT_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// GET BY ID
const getSingleAcademicDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.academicDepartment.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });
    // RETURN
    return result;
});
// GET ALL FROM DB
const getAllAcademicDepartments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // QUERY BUILDER
    const andCondition = [];
    // Search in Field
    if (searchTerm) {
        andCondition.push({
            OR: academicDepartment_constant_1.academicDepartmentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // field Filtering
    if (Object.keys(filtersData).length) {
        andCondition.push({
            AND: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    // BUILD QUERY
    const whereCondition = andCondition.length ? { AND: andCondition } : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.academicDepartment.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            academicFaculty: true,
            faculties: true,
            students: true,
        },
    });
    // GET TOTAL COUNT
    const totalCount = yield prisma_1.prisma.academicDepartment.count();
    // RETURN
    return {
        meta: {
            page,
            limit,
            total: totalCount,
        },
        data: result,
    };
});
// UPDATE ACADEMIC DEPARTMENT
const updateAcademicDepartment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF DEPARTMENT EXISTS
    const isExist = yield prisma_1.prisma.academicDepartment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Academic Department not found');
    }
    // VALIDATE ACADEMIC FACULTY ID EXISTS
    const facultyExists = yield prisma_1.prisma.academicFaculty.findUnique({
        where: { id: payload.academicFacultyId },
    });
    //
    if (!facultyExists) {
        throw new ApiError_1.default(http_status_1.default.PRECONDITION_FAILED, 'Invalid academicFacultyId');
    }
    // UPDATE ON DATABASE
    const result = yield prisma_1.prisma.academicDepartment.update({
        where: { id },
        data: payload,
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicDepartment_constant_1.EVENT_ACADEMIC_DEPARTMENT_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE ACADEMIC DEPARTMENT
const deleteAcademicDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF DEPARTMENT EXISTS
    const isExist = yield prisma_1.prisma.academicDepartment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Academic Department not found');
    }
    // DELETE ON DATABASE
    const result = yield prisma_1.prisma.academicDepartment.delete({
        where: { id },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicDepartment_constant_1.EVENT_ACADEMIC_DEPARTMENT_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT SERVICES
exports.AcademicDepartmentService = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
};
