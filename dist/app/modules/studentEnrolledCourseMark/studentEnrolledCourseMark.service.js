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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseMarkService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../shared/prisma");
const studentEnrolledCourseMark_utils_1 = require("./studentEnrolledCourseMark.utils");
const redis_1 = require("../../../shared/redis");
const studentEnrolledCourseMark_constant_1 = require("./studentEnrolledCourseMark.constant");
// CREATE STUDENT ENROLLED COURSE MARK
const createStudentEnrolledCourseDefaultMark = (prismaClient, // enforce type
payload) => __awaiter(void 0, void 0, void 0, function* () {
    const midtermMark = yield prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            studentId: payload.studentId,
            academicSemesterId: payload.academicSemesterId,
            studentEnrolledCourseId: payload.studentEnrolledCourseId,
            examType: client_1.ExamType.MIDTERM,
        },
    });
    if (!midtermMark) {
        yield prismaClient.studentEnrolledCourseMark.create({
            data: Object.assign(Object.assign({}, payload), { examType: client_1.ExamType.MIDTERM }),
        });
    }
    const finalMark = yield prismaClient.studentEnrolledCourseMark.findFirst({
        where: {
            studentId: payload.studentId,
            academicSemesterId: payload.academicSemesterId,
            studentEnrolledCourseId: payload.studentEnrolledCourseId,
            examType: client_1.ExamType.FINAL,
        },
    });
    if (!finalMark) {
        yield prismaClient.studentEnrolledCourseMark.create({
            data: Object.assign(Object.assign({}, payload), { examType: client_1.ExamType.FINAL }),
        });
    }
});
// UPDATE STUDENT ENROLLED COURSE MARK
const updateStudentEnrolledCourseMark = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, academicSemesterId, courseId, examType, mark } = payload;
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const getStudentEnrolledCourseDefaultMark = yield prisma_1.prisma.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                id: studentId,
            },
            academicSemester: { id: academicSemesterId },
            studentEnrolledCourse: {
                course: {
                    id: courseId,
                },
            },
            examType,
        },
    });
    if (!getStudentEnrolledCourseDefaultMark) {
        throw new Error('Student enrolled course mark not found');
    }
    // GET GRADE FROM CALCULATE MARK FUNCTION
    // CHECK IF THE MARK IS VALID
    const { grade } = yield studentEnrolledCourseMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMark(mark);
    // UPDATE
    const updatedMark = yield prisma_1.prisma.studentEnrolledCourseMark.update({
        where: { id: getStudentEnrolledCourseDefaultMark.id },
        data: { mark, grade },
    });
    if (!updatedMark) {
        throw new Error('Failed to update student enrolled course mark');
    }
    //  PUBLISH ON REDIS
    if (updatedMark) {
        yield redis_1.RedisClient.publish(studentEnrolledCourseMark_constant_1.EVENT_STUDENT_ENROLLED_COURSE_MARK_UPDATED, JSON.stringify(updatedMark));
    }
    // RETURN TO THE CONTROLLER
    return updatedMark;
});
// UPDATE FINAL MARK
const updateStudentFinalMark = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { studentId, academicSemesterId, courseId } = payload;
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const studentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.findFirst({
        where: { studentId, academicSemesterId, courseId },
    });
    if (!studentEnrolledCourse) {
        throw new Error('Student enrolled course not found');
    }
    const studentEnrolledCourseMarks = yield prisma_1.prisma.studentEnrolledCourseMark.findMany({
        where: {
            studentId,
            academicSemesterId,
            studentEnrolledCourseId: studentEnrolledCourse.id,
        },
    });
    if (studentEnrolledCourseMarks.length === 0) {
        throw new Error('Student enrolled course mark not found');
    }
    const midtermMarks = ((_a = studentEnrolledCourseMarks.find(item => item.examType === client_1.ExamType.MIDTERM)) === null || _a === void 0 ? void 0 : _a.mark) || 0;
    const finalMarks = ((_b = studentEnrolledCourseMarks.find(item => item.examType === client_1.ExamType.FINAL)) === null || _b === void 0 ? void 0 : _b.mark) || 0;
    const totalMarks = Math.ceil(midtermMarks * 0.4) + Math.ceil(finalMarks * 0.6);
    // GET GRADE FROM CALCULATE MARK FUNCTION
    // CHECK IF THE MARK IS VALID
    const { grade, points } = yield studentEnrolledCourseMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMark(totalMarks);
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const updateStudentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.update({
        where: { id: studentEnrolledCourse.id },
        data: { points, grade, status: client_1.StudentEnrolledCourseStatus.COMPLETED },
    });
    if (!updateStudentEnrolledCourse) {
        throw new Error('Failed to update student enrolled course mark');
    }
    const grades = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                id: studentId,
            },
        },
        include: {
            course: true,
            studentEnrolledCourseMarks: true,
            // academicSemester: true,
        },
    });
    // CALCULATE CGPA
    const academicResult = yield studentEnrolledCourseMark_utils_1.StudentEnrolledCourseMarkUtils.calcGradeAndCGPA(grades);
    const studentAcademicInfo = yield prisma_1.prisma.studentAcademicInfo.findFirst({
        where: { student: { id: studentId } },
    });
    if (studentAcademicInfo) {
        yield prisma_1.prisma.studentAcademicInfo.update({
            where: {
                id: studentAcademicInfo.id,
            },
            data: {
                cgpa: academicResult.cgpa,
                totalCreditCompleted: academicResult.totalCreditCompleted,
            },
        });
    }
    else {
        yield prisma_1.prisma.studentAcademicInfo.create({
            data: {
                student: {
                    connect: { id: studentId },
                },
                cgpa: academicResult.cgpa,
                totalCreditCompleted: academicResult.totalCreditCompleted,
            },
        });
    }
    // RETURN TO THE CONTROLLER
    return grades;
});
// GET SINGLE STUDENT ENROLLED COURSE MARK
const getSingleStudentEnrolledCourseMark = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const studentMark = yield prisma_1.prisma.studentEnrolledCourseMark.findUnique({
        where: { id },
    });
    if (!studentMark) {
        throw new Error('Student enrolled course mark not found');
    }
    return studentMark;
});
// GET ALL STUDENT ENROLLED COURSE MARK
const getAllStudentEnrolledCourseMark = () => __awaiter(void 0, void 0, void 0, function* () {
    const studentMarks = yield prisma_1.prisma.studentEnrolledCourseMark.findMany({
        include: {
            student: true,
            studentEnrolledCourse: {
                include: {
                    course: true,
                },
            },
            academicSemester: true,
        },
    });
    return studentMarks;
});
// EXPORT
exports.StudentEnrolledCourseMarkService = {
    createStudentEnrolledCourseDefaultMark,
    updateStudentEnrolledCourseMark,
    updateStudentFinalMark,
    getAllStudentEnrolledCourseMark,
    getSingleStudentEnrolledCourseMark,
};
