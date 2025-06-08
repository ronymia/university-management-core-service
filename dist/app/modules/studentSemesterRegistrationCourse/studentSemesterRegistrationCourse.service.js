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
exports.StudentSemesterRegistrationCourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = require("../../../shared/prisma");
const client_1 = require("@prisma/client");
const enrolledIntoCourse = (_a) => __awaiter(void 0, [_a], void 0, function* ({ authUserId, payload, }) {
    // GET STUDENT
    const studentInfo = yield prisma_1.prisma.student.findUnique({
        where: {
            studentId: authUserId,
        },
    });
    if (!studentInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student not found');
    }
    // GET OFFERED COURSE
    const offeredCourseInfo = yield prisma_1.prisma.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });
    //
    if (!offeredCourseInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Offered Course not found');
    }
    // GET OFFERED COURSE SECTION
    const offeredCourseSectionInfo = yield prisma_1.prisma.offeredCourseSection.findFirst({
        where: {
            id: payload.offeredCourseSectionId,
        },
    });
    //
    if (!offeredCourseSectionInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Offered Course Section not found');
    }
    // GET ONGOING SEMESTER
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Currently No Semester Registration ongoing');
    }
    // CHECK STUDENT CAPACITY
    if (offeredCourseSectionInfo.maxCapacity &&
        offeredCourseSectionInfo.currentEnrolledStudent &&
        offeredCourseSectionInfo.currentEnrolledStudent >=
            offeredCourseSectionInfo.maxCapacity) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student Capacity is full');
    }
    // ENROLL
    yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE
        yield transactionClient.studentSemesterRegistrationCourse.create({
            data: {
                studentId: studentInfo.id,
                semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
                offeredCourseId: payload.offeredCourseId,
                offeredCourseSectionId: payload.offeredCourseSectionId,
            },
        });
        // UPDATE OFFERED COURSE SECTION CURRENT ENROLLED STUDENT
        yield transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId,
            },
            data: {
                currentEnrolledStudent: {
                    increment: 1,
                },
            },
        });
        // UPDATE STUDENT TOTAL CREDITS
        yield transactionClient.studentSemesterRegistration.updateMany({
            where: {
                studentId: studentInfo.id,
                semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
            },
            data: {
                totalCreditsTaken: {
                    increment: offeredCourseInfo.course.credits,
                },
            },
        });
        // UPDATE SEMESTER REGISTRATION TOTAL CREDITS
    }));
    // RETURN
    return { message: `Student Course Enrollment Successfully` };
});
const withdrawFromEnrolledCourse = (_b) => __awaiter(void 0, [_b], void 0, function* ({ authUserId, payload, }) {
    // GET STUDENT
    const studentInfo = yield prisma_1.prisma.student.findUnique({
        where: {
            studentId: authUserId,
        },
    });
    if (!studentInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student not found');
    }
    // GET OFFERED COURSE
    const offeredCourseInfo = yield prisma_1.prisma.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });
    //
    if (!offeredCourseInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Offered Course not found');
    }
    // GET ONGOING SEMESTER
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Currently No Semester Registration ongoing');
    }
    // ENROLL
    yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE
        yield transactionClient.studentSemesterRegistrationCourse.delete({
            where: {
                studentId_semesterRegistrationId_offeredCourseId: {
                    studentId: studentInfo.id,
                    semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
                    offeredCourseId: payload.offeredCourseId,
                },
            },
        });
        // UPDATE OFFERED COURSE SECTION CURRENT ENROLLED STUDENT
        yield transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId,
            },
            data: {
                currentEnrolledStudent: {
                    decrement: 1,
                },
            },
        });
        // UPDATE STUDENT TOTAL CREDITS
        yield transactionClient.studentSemesterRegistration.updateMany({
            where: {
                studentId: studentInfo.id,
                semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
            },
            data: {
                totalCreditsTaken: {
                    decrement: offeredCourseInfo.course.credits,
                },
            },
        });
        // UPDATE SEMESTER REGISTRATION TOTAL CREDITS
    }));
    // RETURN
    return { message: `Student Course Withdraw Successfully` };
});
exports.StudentSemesterRegistrationCourseService = {
    enrolledIntoCourse,
    withdrawFromEnrolledCourse,
};
