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
exports.StudentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const student_constant_1 = require("./student.constant");
const student_utils_1 = require("./student.utils");
const createStudent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.student.create({
        data: payload,
        include: {
            academicSemester: true,
            academicDepartment: true,
            academicFaculty: true,
        },
    });
    return result;
});
const getSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.student.findUnique({
        where: { id },
    });
    return result;
});
const getAllStudents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: student_constant_1.studentSearchableFields.map(field => ({
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
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    const result = yield prisma_1.prisma.student.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            academicDepartment: true,
            academicFaculty: true,
            academicSemester: true,
        },
    });
    const total = yield prisma_1.prisma.student.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateStudent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.student.findUnique({
        where: { studentId: id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    // Update the student document
    const result = yield prisma_1.prisma.student.update({
        where: { studentId: id },
        data: payload,
        include: {
            academicSemester: true,
            academicDepartment: true,
            academicFaculty: true,
        },
    });
    return result;
});
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.student.findUnique({
        where: { studentId: id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const result = yield prisma_1.prisma.student.delete({
        where: { studentId: id },
    });
    return result;
});
// MY COURSES
const myCourses = (authUserId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filters.academicSemesterId) {
        const getCurrentAcademicSemester = yield prisma_1.prisma.academicSemester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        //
        filters.academicSemesterId = getCurrentAcademicSemester === null || getCurrentAcademicSemester === void 0 ? void 0 : getCurrentAcademicSemester.id;
    }
    //
    const studentEnrolledCourses = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            academicSemesterId: filters.academicSemesterId,
            student: {
                studentId: authUserId,
            },
        },
        include: {
            course: true,
        },
    });
    if (!studentEnrolledCourses) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No courses found for the student');
    }
    // console.log({ studentEnrolledCourses });
    return studentEnrolledCourses;
});
const mySemesterRegCourses = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const getStudent = yield prisma_1.prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    if (!getStudent) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const getSemesterRegistration = yield prisma_1.prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [
                    client_1.SemesterRegistrationStatus.UPCOMING,
                    client_1.SemesterRegistrationStatus.ONGOING,
                ],
            },
        },
    });
    if (!getSemesterRegistration) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No semester registration found');
    }
    // GET STUDENT COMPLETED COURSES
    const studentCompletedCourses = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            student: { id: getStudent.id },
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
        include: {
            course: true,
        },
    });
    // GET STUDENT CURRENT SEMESTER TAKEN COURSES
    const studentCurrentSemesterTakenCourses = yield prisma_1.prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            studentId: getStudent.id,
            semesterRegistrationId: getSemesterRegistration === null || getSemesterRegistration === void 0 ? void 0 : getSemesterRegistration.id,
        },
        include: {
            offeredCourse: true,
            offeredCourseSection: true,
        },
    });
    // GET ALL OFFERED COURSES
    const offeredCourse = yield prisma_1.prisma.offeredCourse.findMany({
        where: {
            semesterRegistration: {
                id: getSemesterRegistration === null || getSemesterRegistration === void 0 ? void 0 : getSemesterRegistration.id,
            },
            academicDepartment: {
                id: getStudent === null || getStudent === void 0 ? void 0 : getStudent.academicDepartmentId,
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
    const availableCourses = yield student_utils_1.StudentUtils.getAvailableCourses(offeredCourse, studentCompletedCourses, studentCurrentSemesterTakenCourses);
    return availableCourses;
});
// MY COURSE SCHEDULES
const myCourseSchedules = (authUserId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ authUserId });
    if (!filters.academicSemesterId) {
        const getCurrentAcademicSemester = yield prisma_1.prisma.academicSemester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        //
        filters.academicSemesterId = getCurrentAcademicSemester === null || getCurrentAcademicSemester === void 0 ? void 0 : getCurrentAcademicSemester.id;
    }
    // console.log({ filters });
    const studentEnrolledCourses = yield myCourses(authUserId, filters);
    // console.log({ first: studentEnrolledCourses });
    const studentEnrolledCourseIds = studentEnrolledCourses.map((course) => course.courseId);
    // console.log({ studentEnrolledCourseIds });
    const result = yield prisma_1.prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            semesterRegistration: {
                academicSemester: {
                    id: filters.academicSemesterId,
                },
            },
            offeredCourse: {
                course: {
                    id: {
                        in: studentEnrolledCourseIds,
                    },
                },
            },
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
            offeredCourseSection: {
                include: {
                    offeredCourseClassSchedules: {
                        include: {
                            room: {
                                include: {
                                    building: true,
                                },
                            },
                            faculty: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
// const myCourseSchedules = async (authUserId: string): Promise<any> => {
//   const getStudent = await prisma.student.findFirst({
//     where: {
//       studentId: authUserId,
//     },
//   });
//   if (!getStudent) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
//   }
//   const getSemesterRegistration = await prisma.semesterRegistration.findFirst({
//     where: {
//       status: {
//         in: [
//           SemesterRegistrationStatus.UPCOMING,
//           SemesterRegistrationStatus.ONGOING,
//         ],
//       },
//     },
//   });
//   if (!getSemesterRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No semester registration found');
//   }
//   // GET STUDENT CURRENT SEMESTER TAKEN COURSES
//   const studentCurrentSemesterTakenCourses =
//     await prisma.studentSemesterRegistrationCourse.findMany({
//       where: {
//         studentId: getStudent.id,
//         semesterRegistrationId: getSemesterRegistration?.id,
//       },
//       include: {
//         offeredCourse: true,
//         offeredCourseSection: {
//           include: {
//             offeredCourseClassSchedules: {
//               include: {
//                 room: {
//                   include: {
//                     building: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//   return studentCurrentSemesterTakenCourses;
// };
// MY ACADEMIC INFORMATION
const myAcademicInfo = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const academicInfo = yield prisma_1.prisma.studentAcademicInfo.findFirst({
        where: {
            student: {
                studentId: authUserId,
            },
        },
    });
    const enrolledCourses = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
        include: {
            course: true,
            academicSemester: true,
        },
    });
    const groupAcademicSemesterData = yield student_utils_1.StudentUtils.groupByAcademicSemester(enrolledCourses);
    return { academicInfo, enrolledCourses: groupAcademicSemesterData };
});
// CREATE STUDENT FROM EVENT
const createStudentFromEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield createStudent(event);
});
// UPDATE STUDENT FROM EVENT
const updateStudentFromEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('event', event);
    const getStudent = yield prisma_1.prisma.student.findUnique({
        where: {
            studentId: event.studentId,
        },
    });
    if (!getStudent) {
        yield createStudent(event);
    }
    yield updateStudent(event.studentId, event);
});
// DELETE STUDENT FROM EVENT
const deleteStudentFromEvent = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteStudent(studentId);
});
// EXPORT
exports.StudentService = {
    createStudent,
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
    myCourses,
    mySemesterRegCourses,
    myCourseSchedules,
    myAcademicInfo,
    createStudentFromEvent,
    updateStudentFromEvent,
    deleteStudentFromEvent,
};
