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
exports.SemesterRegistrationService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const studentSemesterRegistrationCourse_service_1 = require("../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service");
const asyncForEach_1 = __importDefault(require("../../../shared/asyncForEach"));
const studentSemesterPayment_service_1 = require("../studentSemesterPayment/studentSemesterPayment.service");
const studentEnrolledCourseMark_service_1 = require("../studentEnrolledCourseMark/studentEnrolledCourseMark.service");
const semesterRegistration_utils_1 = require("./semesterRegistration.utils");
// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SEMESTER REGISTRATION EXISTS
    const isExist = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            academicSemesterId: payload.academicSemesterId,
            OR: [
                {
                    status: client_1.SemesterRegistrationStatus.UPCOMING,
                },
                {
                    status: client_1.SemesterRegistrationStatus.ONGOING,
                },
            ],
        },
    });
    // THROW ERROR
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `This Semester registration already ${isExist.status}`);
    }
    // CREATE
    const result = yield prisma_1.prisma.semesterRegistration.create({
        data: payload,
    });
    // RETURN
    return result;
});
// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // GET BY ID
    const result = yield prisma_1.prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
    });
    // RETURN
    return result;
});
// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // FILTER
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // console.log({ filtersData });
    // QUERY BUILDER
    const andCondition = [];
    // SEARCH IN FIELD
    if (searchTerm) {
        andCondition.push({
            OR: semesterRegistration_constant_1.semesterRegistrationSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // FILTERING
    if (Object.keys(filtersData).length) {
        andCondition.push({
            AND: Object.entries(filtersData).map(([field, value]) => {
                // Convert minCredit/maxCredit to number
                if (semesterRegistration_constant_1.semesterRegistrationNumericFilterableFields.includes(field)) {
                    return { [field]: Number(value) };
                }
                if (Array.isArray(value)) {
                    return {
                        [field]: {
                            in: value,
                        },
                    };
                }
                // Keep status/code/startDate/endDate as-is
                return { [field]: value };
            }),
        });
    }
    // QUERY
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    // EXECUTE QUERY
    const result = yield prisma_1.prisma.semesterRegistration.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            academicSemester: true,
        },
    });
    // TOTAL COUNT
    const total = yield prisma_1.prisma.semesterRegistration.count({
        where: whereCondition,
    });
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.semesterRegistration.count({
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
// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SEMESTER REGISTRATION EXISTS
    const isExist = yield prisma_1.prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
    });
    // THROW ERROR
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Semester Registration not found');
    }
    //
    if (payload.status &&
        isExist.status === client_1.SemesterRegistrationStatus.UPCOMING &&
        payload.status !== client_1.SemesterRegistrationStatus.ONGOING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Can only change status from ${client_1.SemesterRegistrationStatus.UPCOMING} To ${client_1.SemesterRegistrationStatus.ONGOING}`);
    }
    else if (payload.status &&
        isExist.status === client_1.SemesterRegistrationStatus.ONGOING &&
        payload.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Can change status from ${client_1.SemesterRegistrationStatus.ONGOING} to ${client_1.SemesterRegistrationStatus.ENDED}`);
    }
    // UPDATE
    const result = yield prisma_1.prisma.semesterRegistration.update({
        where: {
            id,
        },
        data: payload,
    });
    // RETURN
    return result;
});
// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SEMESTER REGISTRATION EXISTS
    const isExist = yield prisma_1.prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
    });
    // THROW ERROR
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Semester Registration not found');
    }
    // DELETE
    const result = yield prisma_1.prisma.semesterRegistration.delete({
        where: {
            id,
        },
    });
    // RETURN
    return result;
});
// ENROLL INTO SEMESTER REGISTRATION
const enrollIntoSemesterRegistration = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // GET STUDENT INFO
    const studentInfo = yield prisma_1.prisma.student.findUnique({
        where: {
            studentId: authUserId,
        },
    });
    if (!studentInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student not found');
    }
    const semesterRegistrationInfo = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [
                    client_1.SemesterRegistrationStatus.ONGOING,
                    client_1.SemesterRegistrationStatus.UPCOMING,
                ],
            },
        },
    });
    if (!semesterRegistrationInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester Registration not found');
    }
    const studentEnrolledSemesters = yield prisma_1.prisma.studentSemesterRegistration.findFirst({
        where: {
            studentId: studentInfo.id,
            semesterRegistrationId: semesterRegistrationInfo.id,
        },
    });
    if (studentEnrolledSemesters) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `Student already enrolled on ${studentEnrolledSemesters.semesterRegistrationId}`);
    }
    // ENROLLED
    const studentEnrolled = yield prisma_1.prisma.studentSemesterRegistration.create({
        data: {
            student: {
                connect: {
                    id: studentInfo.id,
                },
            },
            semesterRegistration: {
                connect: {
                    id: semesterRegistrationInfo.id,
                },
            },
        },
    });
    // RETURN
    return {
        semesterRegistration: semesterRegistrationInfo,
        studentSemesterRegistration: studentEnrolled,
    };
});
const enrolledIntoCourse = (_a) => __awaiter(void 0, [_a], void 0, function* ({ authUserId, payload, }) {
    return yield studentSemesterRegistrationCourse_service_1.StudentSemesterRegistrationCourseService.enrolledIntoCourse({
        authUserId,
        payload,
    });
});
// WITHDRAW FROM COURSE
const withdrawFromEnrolledCourse = (_b) => __awaiter(void 0, [_b], void 0, function* ({ authUserId, payload, }) {
    return yield studentSemesterRegistrationCourse_service_1.StudentSemesterRegistrationCourseService.withdrawFromEnrolledCourse({
        authUserId,
        payload,
    });
});
// CONFIRM MY REGISTRATION
const confirmMyRegistration = (_c) => __awaiter(void 0, [_c], void 0, function* ({ authUserId, }) {
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    const studentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistrationId: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
            student: {
                studentId: authUserId,
            },
        },
    });
    if (!studentSemesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not registered for this semester');
    }
    if ((studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.totalCreditsTaken) === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not recognized for this semester');
    }
    if (((studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.totalCreditsTaken) &&
        (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.minCredit) &&
        (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.minCredit) >
            (studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.totalCreditsTaken)) ||
        ((studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.totalCreditsTaken) &&
            (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit) &&
            (semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit) <
                (studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.totalCreditsTaken))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You can only take ${semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.minCredit} To ${semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit} credits`);
    }
    yield prisma_1.prisma.studentSemesterRegistration.update({
        where: {
            id: studentSemesterRegistration === null || studentSemesterRegistration === void 0 ? void 0 : studentSemesterRegistration.id,
        },
        data: {
            isConfirmed: true,
        },
        include: {
            student: true,
        },
    });
    return {
        message: 'Your registration is confirmed',
    };
});
// GWR MY REGISTRATION
const getMyRegistration = (_d) => __awaiter(void 0, [_d], void 0, function* ({ authUserId }) {
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
        include: {
            offeredCourses: true,
            offeredCourseSections: true,
        },
    });
    const studentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
            },
            student: {
                studentId: authUserId,
            },
        },
        include: {
            student: true,
        },
    });
    return { semesterRegistration, studentSemesterRegistration };
});
// START NEW SEMESTER
const startNewSemester = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
        include: {
            academicSemester: true,
        },
    });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester Registration Not found!');
    }
    if (semesterRegistration.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester Registration is not ended yet!');
    }
    if (semesterRegistration.academicSemester.isCurrent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester is already started!');
    }
    yield prisma_1.prisma.$transaction((prismaTransactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield prismaTransactionClient.academicSemester.updateMany({
            where: {
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            },
        });
        // UPDATE SEMESTER
        yield prismaTransactionClient.academicSemester.update({
            where: {
                id: semesterRegistration.academicSemesterId,
            },
            data: {
                isCurrent: true,
            },
        });
        // CREATE STUDENT SEMESTER PAYMENT
        const studentSemesterRegistrations = yield prisma_1.prisma.studentSemesterRegistration.findMany({
            where: {
                semesterRegistration: {
                    id,
                },
                isConfirmed: true,
            },
        });
        yield (0, asyncForEach_1.default)(studentSemesterRegistrations, (studentSemReg) => __awaiter(void 0, void 0, void 0, function* () {
            if (studentSemReg.totalCreditsTaken) {
                const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
                yield studentSemesterPayment_service_1.StudentSemesterPaymentService.createSemesterPayment(prismaTransactionClient, {
                    studentId: studentSemReg.studentId,
                    academicSemesterId: semesterRegistration.academicSemesterId,
                    totalPaymentAmount: totalSemesterPaymentAmount,
                });
            }
            const studentSemesterRegistrationCourses = yield prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
                where: {
                    semesterRegistration: {
                        id,
                    },
                    student: {
                        id: studentSemReg.studentId,
                    },
                },
                include: {
                    offeredCourse: {
                        include: {
                            course: true,
                        },
                    },
                },
            });
            yield (0, asyncForEach_1.default)(studentSemesterRegistrationCourses, (item) => __awaiter(void 0, void 0, void 0, function* () {
                const isExistEnrolledData = yield prismaTransactionClient.studentEnrolledCourse.findFirst({
                    where: {
                        student: { id: item.studentId },
                        course: { id: item.offeredCourse.courseId },
                        academicSemester: {
                            id: semesterRegistration.academicSemesterId,
                        },
                    },
                });
                // console.log({ isExistEnrolledData });
                if (!isExistEnrolledData) {
                    const enrolledCourseData = {
                        studentId: item.studentId,
                        courseId: item.offeredCourse.courseId,
                        academicSemesterId: semesterRegistration.academicSemesterId,
                    };
                    // console.log({ enrolledCourseData });
                    const studentEnrolledCourseData = yield prismaTransactionClient.studentEnrolledCourse.create({
                        data: enrolledCourseData,
                    });
                    yield studentEnrolledCourseMark_service_1.StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(prismaTransactionClient, {
                        studentId: item.studentId,
                        studentEnrolledCourseId: studentEnrolledCourseData.id,
                        academicSemesterId: semesterRegistration.academicSemesterId,
                    });
                }
            }));
        }));
    }), {
        timeout: 10000,
    });
    return {
        message: 'Semester started successfully!',
    };
});
const startMyRegistration = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const studentInfo = yield prisma_1.prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    if (!studentInfo) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Student Info not found!');
    }
    const semesterRegistrationInfo = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [
                    client_1.SemesterRegistrationStatus.ONGOING,
                    client_1.SemesterRegistrationStatus.UPCOMING,
                ],
            },
        },
    });
    if ((semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.status) === client_1.SemesterRegistrationStatus.UPCOMING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Registration is not started yet');
    }
    let studentRegistration = yield prisma_1.prisma.studentSemesterRegistration.findFirst({
        where: {
            student: {
                id: studentInfo === null || studentInfo === void 0 ? void 0 : studentInfo.id,
            },
            semesterRegistration: {
                id: semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.id,
            },
        },
    });
    if (!studentRegistration) {
        studentRegistration = yield prisma_1.prisma.studentSemesterRegistration.create({
            data: {
                student: {
                    connect: {
                        id: studentInfo === null || studentInfo === void 0 ? void 0 : studentInfo.id,
                    },
                },
                semesterRegistration: {
                    connect: {
                        id: semesterRegistrationInfo === null || semesterRegistrationInfo === void 0 ? void 0 : semesterRegistrationInfo.id,
                    },
                },
            },
        });
    }
    return {
        semesterRegistration: semesterRegistrationInfo,
        studentSemesterRegistration: studentRegistration,
    };
});
const getMySemesterRegCourses = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield prisma_1.prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    // console.log({ student });
    const semesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [
                    client_1.SemesterRegistrationStatus.UPCOMING,
                    client_1.SemesterRegistrationStatus.ONGOING,
                ],
            },
        },
        include: {
            academicSemester: true,
        },
    });
    console.log({ semesterRegistration });
    if (!semesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No semester registration not found!');
    }
    const studentCompletedCourse = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
            student: {
                id: student === null || student === void 0 ? void 0 : student.id,
            },
        },
        include: {
            course: true,
        },
    });
    const studentCurrentSemesterTakenCourse = yield prisma_1.prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            student: {
                id: student === null || student === void 0 ? void 0 : student.id,
            },
            semesterRegistration: {
                id: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.id,
            },
        },
        include: {
            offeredCourse: true,
            offeredCourseSection: true,
        },
    });
    // console.log({ studentCurrentSemesterTakenCourse });
    const offeredCourse = yield prisma_1.prisma.offeredCourse.findMany({
        where: {
            semesterRegistration: {
                id: semesterRegistration.id,
            },
            academicDepartment: {
                id: student === null || student === void 0 ? void 0 : student.academicDepartmentId,
            },
        },
        include: {
            course: {
                include: {
                    preRequisite: {
                        include: {
                            preRequisite: true,
                        },
                    },
                },
            },
            offeredCourseSections: {
                include: {
                    offeredCourseClassSchedules: {
                        include: {
                            room: {
                                include: {
                                    building: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    // console.log('Offered course: ', offeredCourse);
    const availableCourses = semesterRegistration_utils_1.SemesterRegistrationUtils.getAvailableCourses(offeredCourse, studentCompletedCourse, studentCurrentSemesterTakenCourse);
    // console.log({ availableCourses });
    return availableCourses;
});
// EXPORT
exports.SemesterRegistrationService = {
    createSemesterRegistration,
    getSingleSemesterRegistration,
    getAllSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration,
    enrollIntoSemesterRegistration,
    enrolledIntoCourse,
    withdrawFromEnrolledCourse,
    confirmMyRegistration,
    getMyRegistration,
    startNewSemester,
    startMyRegistration,
    getMySemesterRegCourses,
};
