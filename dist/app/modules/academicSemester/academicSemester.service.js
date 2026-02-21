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
exports.AcademicSemesterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const academicSemester_constant_1 = require("./academicSemester.constant");
const prisma_1 = require("../../../shared/prisma");
// CREATE ACADEMIC SEMESTER
const createAcademicSemester = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //VERIFY TITLE AND CODE MATCH
    if (academicSemester_constant_1.academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new ApiError_1.default(http_status_1.default.UNPROCESSABLE_ENTITY, 'Invalid academic semester code');
    }
    // CREATE SEMESTER WITH OUTBOX
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const created = yield tx.academicSemester.create({
            data: payload,
        });
        yield tx.outbox.create({
            data: {
                eventType: academicSemester_constant_1.EVENT_ACADEMIC_SEMESTER_CREATED,
                payload: JSON.stringify(created),
            },
        });
        return created;
    }));
    // RETURN
    return result;
});
// GET ACADEMIC SEMESTER BY ID SINGLE
const getSingleAcademicSemester = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const fetched = yield tx.academicSemester.findUnique({
            where: {
                id: id,
            },
        });
        if (fetched) {
            yield tx.outbox.create({
                data: {
                    eventType: academicSemester_constant_1.EVENT_ACADEMIC_SEMESTER_GET_BY_ID,
                    payload: JSON.stringify(fetched),
                },
            });
        }
        return fetched;
    }));
    // RETURN
    return result;
});
// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemesters = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract SearchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // Search and filter condition
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: academicSemester_constant_1.academicSemesterSearchableFields.map(field => ({
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
    // If there is no condition , put {} to give all data
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    // EXECUTE QUERY WITH OUTBOX
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const fetched = yield tx.academicSemester.findMany({
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            where: whereCondition,
        });
        if (fetched.length > 0) {
            yield tx.outbox.create({
                data: {
                    eventType: academicSemester_constant_1.EVENT_ACADEMIC_SEMESTER_GET_ALL,
                    payload: JSON.stringify(fetched),
                },
            });
        }
        return fetched;
    }));
    // GET TOTAL COUNT
    const totalCount = yield prisma_1.prisma.academicSemester.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = result === null || result === void 0 ? void 0 : result.length;
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
// UPDATE ACADEMIC SEMESTER
const updateAcademicSemester = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF ACADEMIC SEMESTER EXISTS
    const isExist = yield prisma_1.prisma.academicSemester.findUnique({
        where: { id },
    });
    // THROW ERROR
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Academic Semester not found with ${id}`);
    }
    // VERIFY TITLE AND CODE MATCH
    if (payload.title &&
        payload.code &&
        academicSemester_constant_1.academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new ApiError_1.default(http_status_1.default.UNPROCESSABLE_ENTITY, 'Invalid academic semester code');
    }
    // UPDATE ON DATABASE WITH OUTBOX
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updated = yield tx.academicSemester.update({
            where: { id },
            data: payload,
        });
        yield tx.outbox.create({
            data: {
                eventType: academicSemester_constant_1.EVENT_ACADEMIC_SEMESTER_UPDATED,
                payload: JSON.stringify(updated),
            },
        });
        return updated;
    }));
    // RETURN
    return result;
});
// DELETE ACADEMIC SEMESTER
const deleteAcademicSemester = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF ACADEMIC SEMESTER EXISTS
    const isExist = yield prisma_1.prisma.academicSemester.findUnique({
        where: { id },
    });
    // THROW ERROR
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Academic Semester not found with ${id}`);
    }
    // DELETE ON DATABASE WITH OUTBOX
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield tx.academicSemester.delete({
            where: { id },
        });
        yield tx.outbox.create({
            data: {
                eventType: academicSemester_constant_1.EVENT_ACADEMIC_SEMESTER_DELETED,
                payload: JSON.stringify(deleted),
            },
        });
        return deleted;
    }));
    // RETURN
    return result;
});
// EXPORT SERVICES
exports.AcademicSemesterService = {
    createAcademicSemester,
    getSingleAcademicSemester,
    getAllAcademicSemesters,
    updateAcademicSemester,
    deleteAcademicSemester,
};
