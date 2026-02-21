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
const studentSemesterRegistration_constant_1 = require("./studentSemesterRegistration.constant");
const updateStudentSemesterRegistration = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF THE STUDENT SEMESTER REGISTRATION EXISTS
    const existingStudentSemesterRegistration = yield prisma_1.prisma.studentSemesterRegistration.findUnique({
        where: { id },
    });
    if (!existingStudentSemesterRegistration) {
        throw new Error('StudentSemesterRegistration not found');
    }
    // UPDATE WITH OUTBOX
    const updatedStudentSemesterRegistration = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tx.studentSemesterRegistration.update({
            where: { id },
            data: payload,
        });
        yield tx.outbox.create({
            data: {
                eventType: studentSemesterRegistration_constant_1.EVENT_STUDENT_SEMESTER_REGISTRATION_UPDATED,
                payload: JSON.stringify(result),
            },
        });
        return result;
    }));
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
    // DELETE WITH OUTBOX
    const deletedStudentSemesterRegistration = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tx.studentSemesterRegistration.delete({
            where: { id },
        });
        yield tx.outbox.create({
            data: {
                eventType: studentSemesterRegistration_constant_1.EVENT_STUDENT_SEMESTER_REGISTRATION_DELETED,
                payload: JSON.stringify(result),
            },
        });
        return result;
    }));
    return deletedStudentSemesterRegistration;
});
// EXPORT THE SERVICE
exports.StudentSemesterRegistrationService = {
    updateStudentSemesterRegistration,
    deleteStudentSemesterRegistration,
};
