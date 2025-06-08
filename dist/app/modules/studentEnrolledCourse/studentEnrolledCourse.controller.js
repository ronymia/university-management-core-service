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
exports.StudentEnrolledCourseController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const studentEnrolledCourse_service_1 = require("./studentEnrolledCourse.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const studentEnrolledCourse_constant_1 = require("./studentEnrolledCourse.constant");
const pagination_1 = require("../../../constants/pagination");
//  STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield studentEnrolledCourse_service_1.StudentEnrolledCourseService.getSingleStudentEnrolledCourse(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course fetched successfully!',
        data: result,
    });
}));
// GET ALL STUDENT ENROLLED COURSE
const getAllStudentEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterableFields = (0, pick_1.default)(req.query, studentEnrolledCourse_constant_1.studentEnrolledCourseFilterRequest);
    const pagination = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield studentEnrolledCourse_service_1.StudentEnrolledCourseService.getAllStudentEnrolledCourse(filterableFields, pagination);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// UPDATE STUDENT ENROLLED COURSE
const updateStudentEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payloadData = __rest(req.body, []);
    const result = yield studentEnrolledCourse_service_1.StudentEnrolledCourseService.updateStudentEnrolledCourse(id, payloadData);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course updated successfully!',
        data: result,
    });
}));
// DELETE STUDENT ENROLLED COURSE
const deleteStudentEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield studentEnrolledCourse_service_1.StudentEnrolledCourseService.deleteStudentEnrolledCourse(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course deleted successfully!',
        data: result,
    });
}));
// EXPORT
exports.StudentEnrolledCourseController = {
    getSingleStudentEnrolledCourse,
    getAllStudentEnrolledCourse,
    updateStudentEnrolledCourse,
    deleteStudentEnrolledCourse,
};
