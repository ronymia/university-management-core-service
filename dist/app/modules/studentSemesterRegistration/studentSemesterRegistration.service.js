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
exports.StudentSemesterRegistrationService = void 0;
const prisma_1 = require("../../../shared/prisma");
const redis_1 = require("../../../shared/redis");
const studentSemesterRegistration_constant_1 = require("./studentSemesterRegistration.constant");
const updateStudentSemesterRegistration = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT SEMESTER REGISTRATION EXISTS
    const existingStudentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.findUnique({
        where: { id },
    });
    if (!existingStudentSemesterRegistration) {
        throw new Error('StudentSemesterRegistration not found');
    }
    // CHECK IF THE STUDENT SEMESTER REGISTRATION IS ACTIVE
    const updatedStudentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.update({
        where: { id },
        data: payload,
    });
    // PUBLISH ON REDIS
    if (updatedStudentSemesterRegistration) {
        yield redis_1.RedisClient.publish(studentSemesterRegistration_constant_1.EVENT_STUDENT_SEMESTER_REGISTRATION_UPDATED, JSON.stringify(updatedStudentSemesterRegistration));
    }
    return updatedStudentSemesterRegistration;
});
const deleteStudentSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT SEMESTER REGISTRATION EXISTS
    const existingStudentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.findUnique({
        where: { id },
    });
    if (!existingStudentSemesterRegistration) {
        throw new Error('StudentSemesterRegistration not found');
    }
    // CHECK IF THE STUDENT SEMESTER REGISTRATION IS ACTIVE
    const deletedStudentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.delete({
        where: { id },
    });
    // PUBLISH ON REDIS
    if (deletedStudentSemesterRegistration) {
        yield redis_1.RedisClient.publish(studentSemesterRegistration_constant_1.EVENT_STUDENT_SEMESTER_REGISTRATION_DELETED, JSON.stringify(deletedStudentSemesterRegistration));
    }
    return deletedStudentSemesterRegistration;
});
// EXPORT THE SERVICE
exports.StudentSemesterRegistrationService = {
    updateStudentSemesterRegistration,
    deleteStudentSemesterRegistration,
};
