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
const redis_1 = require("../../../shared/redis");
const student_constant_1 = require("./student.constant");
const student_service_1 = require("./student.service");
const initStudentEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE STUDENT
    yield redis_1.RedisClient.subscribe(student_constant_1.EVENT_STUDENT_CREATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const student = JSON.parse(e);
        const studentData = {
            studentId: student === null || student === void 0 ? void 0 : student.id,
            firstName: (_a = student === null || student === void 0 ? void 0 : student.name) === null || _a === void 0 ? void 0 : _a.firstName,
            middleName: (_b = student === null || student === void 0 ? void 0 : student.name) === null || _b === void 0 ? void 0 : _b.middleName,
            lastName: (_c = student === null || student === void 0 ? void 0 : student.name) === null || _c === void 0 ? void 0 : _c.lastName,
            email: student === null || student === void 0 ? void 0 : student.email,
            contactNo: student === null || student === void 0 ? void 0 : student.contactNo,
            emergencyContactNo: student === null || student === void 0 ? void 0 : student.emergencyContactNo,
            gender: student === null || student === void 0 ? void 0 : student.gender,
            bloodGroup: student === null || student === void 0 ? void 0 : student.bloodGroup,
            dateOfBirth: student === null || student === void 0 ? void 0 : student.dateOfBirth,
            profileImage: student === null || student === void 0 ? void 0 : student.profileImage,
            academicSemesterId: (_d = student === null || student === void 0 ? void 0 : student.academicSemester) === null || _d === void 0 ? void 0 : _d.syncId,
            academicDepartmentId: (_e = student === null || student === void 0 ? void 0 : student.academicDepartment) === null || _e === void 0 ? void 0 : _e.syncId,
            academicFacultyId: (_f = student === null || student === void 0 ? void 0 : student.academicFaculty) === null || _f === void 0 ? void 0 : _f.syncId,
        };
        yield student_service_1.StudentService.createStudentFromEvent(studentData);
    }));
    // UPDATE STUDENT
    yield redis_1.RedisClient.subscribe(student_constant_1.EVENT_STUDENT_UPDATED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j, _k, _l, _m;
        const student = JSON.parse(e);
        const studentData = {
            studentId: student === null || student === void 0 ? void 0 : student.id,
            firstName: (_g = student === null || student === void 0 ? void 0 : student.name) === null || _g === void 0 ? void 0 : _g.firstName,
            middleName: (_h = student === null || student === void 0 ? void 0 : student.name) === null || _h === void 0 ? void 0 : _h.middleName,
            lastName: (_j = student === null || student === void 0 ? void 0 : student.name) === null || _j === void 0 ? void 0 : _j.lastName,
            email: student === null || student === void 0 ? void 0 : student.email,
            contactNo: student === null || student === void 0 ? void 0 : student.contactNo,
            emergencyContactNo: student === null || student === void 0 ? void 0 : student.emergencyContactNo,
            gender: student === null || student === void 0 ? void 0 : student.gender,
            bloodGroup: student === null || student === void 0 ? void 0 : student.bloodGroup,
            dateOfBirth: student === null || student === void 0 ? void 0 : student.dateOfBirth,
            profileImage: student === null || student === void 0 ? void 0 : student.profileImage,
            academicSemesterId: (_k = student === null || student === void 0 ? void 0 : student.academicSemester) === null || _k === void 0 ? void 0 : _k.syncId,
            academicDepartmentId: (_l = student === null || student === void 0 ? void 0 : student.academicDepartment) === null || _l === void 0 ? void 0 : _l.syncId,
            academicFacultyId: (_m = student === null || student === void 0 ? void 0 : student.academicFaculty) === null || _m === void 0 ? void 0 : _m.syncId,
        };
        // console.log({ student });
        yield student_service_1.StudentService.updateStudentFromEvent(studentData);
    }));
    // DELETE STUDENT
    yield redis_1.RedisClient.subscribe(student_constant_1.EVENT_STUDENT_DELETED, (e) => __awaiter(void 0, void 0, void 0, function* () {
        const student = JSON.parse(e);
        yield student_service_1.StudentService.deleteStudentFromEvent(student.id);
    }));
});
exports.default = initStudentEvent;
