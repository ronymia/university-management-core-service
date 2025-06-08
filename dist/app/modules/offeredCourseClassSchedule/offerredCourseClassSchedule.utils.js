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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleUtils = void 0;
const prisma_1 = require("../../../shared/prisma");
const dateTime_1 = require("../../../shared/dateTime");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const checkAvailableRoom = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //  CHECK IF SLOT IS ALREADY BOOKED
    const alreadyBookedSlotsOnDay = yield prisma_1.prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: payload.dayOfWeek,
            roomId: payload.roomId,
        },
    });
    // CHECK IF SLOT IS ALREADY BOOKED
    const existingSchedules = alreadyBookedSlotsOnDay.map(schedule => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));
    // NEW SCHEDULE
    const newSchedule = {
        startTime: payload.startTime,
        endTime: payload.endTime,
        dayOfWeek: payload.dayOfWeek,
    };
    for (const schedule of existingSchedules) {
        const existingStartTime = (0, dateTime_1.timeToDate)(schedule.startTime);
        const existingEndTime = (0, dateTime_1.timeToDate)(schedule.endTime);
        const newStartTime = (0, dateTime_1.timeToDate)(newSchedule.startTime);
        const newEndTime = (0, dateTime_1.timeToDate)(newSchedule.endTime);
        if (newStartTime <= existingEndTime && newEndTime >= existingStartTime) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, `Room  is already booked at ${schedule.dayOfWeek} from ${schedule.startTime} to ${schedule.endTime}`);
        }
    }
});
const checkAvailableFaculty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //  CHECK IF SLOT IS ALREADY BOOKED
    const alreadyAssignedFacultyOnDay = yield prisma_1.prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: payload.dayOfWeek,
            facultyId: payload.facultyId,
        },
    });
    // CHECK IF SLOT IS ALREADY BOOKED
    const existingSchedules = alreadyAssignedFacultyOnDay.map(schedule => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));
    // NEW SCHEDULE
    const newSchedule = {
        startTime: payload.startTime,
        endTime: payload.endTime,
        dayOfWeek: payload.dayOfWeek,
    };
    for (const schedule of existingSchedules) {
        const existingStartTime = (0, dateTime_1.timeToDate)(schedule.startTime);
        const existingEndTime = (0, dateTime_1.timeToDate)(schedule.endTime);
        const newStartTime = (0, dateTime_1.timeToDate)(newSchedule.startTime);
        const newEndTime = (0, dateTime_1.timeToDate)(newSchedule.endTime);
        if (newStartTime <= existingEndTime && newEndTime >= existingStartTime) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, `Faculty  is already assigned at ${schedule.dayOfWeek} from ${schedule.startTime} to ${schedule.endTime}`);
        }
    }
});
exports.OfferedCourseClassScheduleUtils = {
    checkAvailableRoom,
    checkAvailableFaculty,
};
