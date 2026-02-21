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
    const { studentId, academicSemesterId, courseId, examType, marks } = payload;
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const getStudentEnrolledCourseDefaultMark = yield prisma_1.prisma.studentEnrolledCourseMark.findFirst({
        where: {
            student: {
                studentId: studentId,
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
    // console.log({ getStudentEnrolledCourseDefaultMark });
    if (!getStudentEnrolledCourseDefaultMark) {
        throw new Error('Student enrolled course mark not found');
    }
    // GET GRADE FROM CALCULATE MARK FUNCTION
    // CHECK IF THE MARK IS VALID
    const { grade } = yield studentEnrolledCourseMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMark(marks);
    // UPDATE WITH OUTBOX
    const updatedMark = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const mark = yield tx.studentEnrolledCourseMark.update({
            where: { id: getStudentEnrolledCourseDefaultMark.id },
            data: { marks, grade },
        });
        if (!mark) {
            throw new Error('Failed to update student enrolled course mark');
        }
        yield tx.outbox.create({
            data: {
                eventType: studentEnrolledCourseMark_constant_1.EVENT_STUDENT_ENROLLED_COURSE_MARK_UPDATED,
                payload: JSON.stringify(mark),
            },
        });
        return mark;
    }));
    // RETURN TO THE CONTROLLER
    return updatedMark;
});
// UPDATE FINAL MARK
const updateStudentFinalMark = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { studentId, academicSemesterId, courseId } = payload;
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const studentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.findFirst({
        where: {
            student: {
                studentId: studentId,
            },
            academicSemesterId,
            courseId,
        },
    });
    if (!studentEnrolledCourse) {
        throw new Error('Student enrolled course not found');
    }
    const studentEnrolledCourseMarks = yield prisma_1.prisma.studentEnrolledCourseMark.findMany({
        where: {
            student: {
                studentId: studentId,
            },
            academicSemesterId,
            studentEnrolledCourseId: studentEnrolledCourse.id,
        },
    });
    if (studentEnrolledCourseMarks.length === 0) {
        throw new Error('Student enrolled course mark not found');
    }
    const midtermMarks = ((_a = studentEnrolledCourseMarks.find(item => item.examType === client_1.ExamType.MIDTERM)) === null || _a === void 0 ? void 0 : _a.marks) || 0;
    const finalMarks = ((_b = studentEnrolledCourseMarks.find(item => item.examType === client_1.ExamType.FINAL)) === null || _b === void 0 ? void 0 : _b.marks) || 0;
    const totalMarks = Math.ceil(midtermMarks * 0.4) + Math.ceil(finalMarks * 0.6);
    // console.log({ midtermMarks, finalMarks, totalMarks });
    // GET GRADE FROM CALCULATE MARK FUNCTION
    // CHECK IF THE MARK IS VALID
    const { grade, points } = yield studentEnrolledCourseMark_utils_1.StudentEnrolledCourseMarkUtils.getGradeFromMark(totalMarks);
    // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
    const updateStudentEnrolledCourse = yield prisma_1.prisma.studentEnrolledCourse.update({
        where: { id: studentEnrolledCourse.id },
        data: {
            points,
            grade,
            totalMarks,
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
    });
    if (!updateStudentEnrolledCourse) {
        throw new Error('Failed to update student enrolled course mark');
    }
    const grades = yield prisma_1.prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                studentId: studentId,
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
        where: { student: { studentId: studentId } },
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
                    connect: { studentId: studentId },
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
