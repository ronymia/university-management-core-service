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
exports.AcademicFacultyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const academicDepartment_constant_1 = require("../academicDepartment/academicDepartment.constant");
const redis_1 = require("../../../shared/redis");
const academicFaculty_constant_1 = require("./academicFaculty.constant");
// CREATE ACADEMIC FACULTY
const createAcademicFaculty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE ON DATABASE
    const result = yield prisma_1.prisma.academicFaculty.create({
        data: payload,
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_CREATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// GET ACADEMIC FACULTY BY ID
const getSingleAcademicFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE
    const result = yield prisma_1.prisma.academicFaculty.findUnique({
        where: {
            id,
        },
    });
    // IF NOT FOUND
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `AcademicFaculty with id '${id}' not found.`);
    }
    // RETURN
    return result;
});
// GET ALL ACADEMIC FACULTY
const getAllAcademicFaculties = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
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
    const result = yield prisma_1.prisma.academicFaculty.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            academicDepartments: {
                include: {
                    academicFaculty: true,
                },
            },
        },
    });
    // GET TOTAL COUNT
    const totalCount = yield prisma_1.prisma.academicFaculty.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.academicFaculty.count({
        where: whereCondition,
    });
    const totalPages = Math.ceil(totalCount / limit);
    // RETURN
    return {
        meta: {
            page,
            limit,
            skip,
            total: totalCount,
            totalPages,
            paginationTotal,
        },
        data: result,
    };
});
// UPDATE ACADEMIC FACULTY
const updateAcademicFaculty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF FACULTY EXISTS
    const isExist = yield prisma_1.prisma.academicFaculty.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `AcademicFaculty not found with id ${id}`);
    }
    // UPDATE ON DATABASE
    const result = yield prisma_1.prisma.academicFaculty.update({
        where: { id },
        data: payload,
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_UPDATED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// DELETE ACADEMIC FACULTY
const deleteAcademicFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF FACULTY EXISTS
    const isExist = yield prisma_1.prisma.academicFaculty.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `AcademicFaculty not found with id ${id}`);
    }
    // DELETE ON DATABASE
    const result = yield prisma_1.prisma.academicFaculty.delete({
        where: { id },
    });
    // PUBLISH EVENT ON REDIS
    if (result) {
        yield redis_1.RedisClient.publish(academicFaculty_constant_1.EVENT_ACADEMIC_FACULTY_DELETED, JSON.stringify(result));
    }
    // RETURN
    return result;
});
// EXPORT SERVICES
exports.AcademicFacultyService = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
    deleteAcademicFaculty,
};
