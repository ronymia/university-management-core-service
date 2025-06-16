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
exports.StudentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const student_constant_1 = require("./student.constant");
const student_service_1 = require("./student.service");
// get single
const createStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentData = __rest(req.body, []);
    const result = yield student_service_1.StudentService.createStudent(studentData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Created successfully!',
        data: result,
    });
}));
// get single
const getSingleStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield student_service_1.StudentService.getSingleStudent(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student fetched successfully!',
        data: result,
    });
}));
// get all
const getAllStudents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, student_constant_1.studentFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield student_service_1.StudentService.getAllStudents(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Student fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// update single
const updateStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield student_service_1.StudentService.updateStudent(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student updated successfully!',
        data: result,
    });
}));
// delete
const deleteStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield student_service_1.StudentService.deleteStudent(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Deleted successfully!',
        data: result,
    });
}));
// GET MY COURSES
const myCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const filterRequest = (0, pick_1.default)(req.query, ['academicSemesterId', 'courseId']);
    const result = yield student_service_1.StudentService.myCourses(authUserId, filterRequest);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Courses fetched successfully!',
        data: result,
    });
}));
// GET MY SEMESTER REGISTRATION COURSES
const mySemesterRegCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authUserId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    // const filterRequest = pick(req.query, ['academicSemesterId', 'courseId']);
    const result = yield student_service_1.StudentService.mySemesterRegCourses(authUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Semester Registration Courses fetched successfully!',
        data: result,
    });
}));
// GET MY COURSE SCHEDULES
const myCourseSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const authUserId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
    // console.log({ first: req.user });
    const filterRequest = (0, pick_1.default)(req.query, ['academicSemesterId', 'courseId']);
    const result = yield student_service_1.StudentService.myCourseSchedules(authUserId, filterRequest);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Course Schedules fetched successfully!',
        data: result,
    });
}));
// GET MY ACADEMIC INFO
const myAcademicInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const authUserId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const result = yield student_service_1.StudentService.myAcademicInfo(authUserId);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Academic Information fetched successfully!',
        data: result,
    });
}));
exports.StudentController = {
    createStudent,
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
    myCourses,
    mySemesterRegCourses,
    myCourseSchedules,
    myAcademicInfo,
};
