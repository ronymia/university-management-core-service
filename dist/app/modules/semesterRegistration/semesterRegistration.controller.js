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
exports.SemesterRegistrationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const semesterRegistration_service_1 = require("./semesterRegistration.service");
// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.createSemesterRegistration(payload);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration created successfully',
        data: result,
    });
}));
// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, semesterRegistration_constant_1.semesterRegistrationFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    // GET ALL
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.getAllSemesterRegistration(filters, paginationOptions);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.getSingleSemesterRegistration(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration fetched successfully',
        data: result,
    });
}));
// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.updateSemesterRegistration(id, req.body);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration updated successfully',
        data: result,
    });
}));
// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.deleteSemesterRegistration(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration deleted successfully',
        data: result,
    });
}));
// ENROLL INTO SEMESTER REGISTRATION
const enrollIntoSemesterRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.enrollIntoSemesterRegistration(payload);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Enrolled Into Semester Registration created successfully',
        data: result,
    });
}));
// ENROLL INTO COURSE
const enrollIntoCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = __rest(req.body, []);
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.enrolledIntoCourse({
        authUserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        payload,
    });
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Enrolled Into Semester Course successfully',
        data: result,
    });
}));
// ENROLL INTO COURSE
const withdrawFromEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const payload = __rest(req.body, []);
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.withdrawFromEnrolledCourse({
        authUserId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
        payload,
    });
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdraw From Semester Course successfully',
        data: result,
    });
}));
// CONFIRM MY REGISTRATION
const confirmMyRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.confirmMyRegistration({
        authUserId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
    });
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Registration Confirmed successfully',
        data: result,
    });
}));
// GET MY REGISTRATION
const getMyRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.getMyRegistration({
        authUserId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId,
    });
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Registration Fetch successfully',
        data: result,
    });
}));
// GET MY REGISTRATION
const startNewSemester = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield semesterRegistration_service_1.SemesterRegistrationService.startNewSemester(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Registration Fetch successfully',
        data: result,
    });
}));
// EXPORT
exports.SemesterRegistrationController = {
    createSemesterRegistration,
    getSingleSemesterRegistration,
    getAllSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration,
    enrollIntoSemesterRegistration,
    enrollIntoCourse,
    withdrawFromEnrolledCourse,
    confirmMyRegistration,
    getMyRegistration,
    startNewSemester,
};
