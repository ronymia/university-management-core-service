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
const faculty_constant_1 = require("./faculty.constant");
const faculty_service_1 = require("./faculty.service");
const initFacultyEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE FACULTY
    yield redis_1.RedisClient.subscribe(faculty_constant_1.EVENT_FACULTY_CREATED, (event) => __awaiter(void 0, void 0, void 0, function* () {
        const faculty = JSON.parse(event);
        const facultyData = {
            facultyId: faculty.id,
            firstName: faculty.name.firstName,
            middleName: faculty.name.middleName,
            lastName: faculty.name.lastName,
            email: faculty.email,
            contactNo: faculty.contactNo,
            gender: faculty.gender,
            bloodGroup: faculty.bloodGroup,
            designation: faculty.designation,
            academicDepartmentId: faculty.academicDepartment.syncId,
            academicFacultyId: faculty.academicFaculty.syncId,
        };
        yield faculty_service_1.FacultyService.createFacultyFromEvent(facultyData);
    }));
    // UPDATE FACULTY
    yield redis_1.RedisClient.subscribe(faculty_constant_1.EVENT_FACULTY_UPDATED, (event) => __awaiter(void 0, void 0, void 0, function* () {
        const faculty = JSON.parse(event);
        const facultyData = {
            facultyId: faculty.id,
            firstName: faculty.name.firstName,
            middleName: faculty.name.middleName,
            lastName: faculty.name.lastName,
            email: faculty.email,
            contactNo: faculty.contactNo,
            gender: faculty.gender,
            bloodGroup: faculty.bloodGroup,
            designation: faculty.designation,
            academicDepartmentId: faculty.academicDepartment.syncId,
            academicFacultyId: faculty.academicFaculty.syncId,
        };
        yield faculty_service_1.FacultyService.updateFacultyFromEvent(facultyData);
    }));
    // DELETE FACULTY
    yield redis_1.RedisClient.subscribe(faculty_constant_1.EVENT_FACULTY_DELETED, (event) => __awaiter(void 0, void 0, void 0, function* () {
        const faculty = JSON.parse(event);
        yield faculty_service_1.FacultyService.deleteFacultyFromEvent(faculty.id);
    }));
});
exports.default = initFacultyEvent;
