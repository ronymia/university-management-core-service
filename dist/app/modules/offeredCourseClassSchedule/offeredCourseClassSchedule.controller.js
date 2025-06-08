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
exports.OfferedCourseClassScheduleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const offeredCourseClassSchedule_constant_1 = require("./offeredCourseClassSchedule.constant");
const offeredCourseClassSchedule_service_1 = require("./offeredCourseClassSchedule.service");
// CREATE
const createOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = __rest(req.body, []);
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleServices.createOfferedCourseClassSchedule(payloadData);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Offered Course Class Schedule created successfully!',
        data: result,
    });
}));
// GET ALL
const getAllOfferedCourseClassSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, offeredCourseClassSchedule_constant_1.offeredCourseClassScheduleFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    // GET DATA
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleServices.getAllOfferedCourseClassSchedules(filters, paginationOptions);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered Course Class Schedule fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// GET SINGLE
const getSingleOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleServices.getSingleOfferedCourseClassSchedule(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered Course Class Schedule fetched successfully!',
        data: result,
    });
}));
// UPDATE
const updateOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payloadData = __rest(req.body, []);
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleServices.updateOfferedCourseClassSchedule(id, payloadData);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered Course Class Schedule updated successfully!',
        data: result,
    });
}));
// DELETE
const deleteOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleServices.deleteOfferedCourseClassSchedule(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered Course Class Schedule deleted successfully!',
        data: result,
    });
}));
// EXPORT
exports.OfferedCourseClassScheduleControllers = {
    createOfferedCourseClassSchedule,
    getAllOfferedCourseClassSchedules,
    getSingleOfferedCourseClassSchedule,
    updateOfferedCourseClassSchedule,
    deleteOfferedCourseClassSchedule,
};
