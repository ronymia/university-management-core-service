"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_STUDENT_DELETED = exports.EVENT_STUDENT_UPDATED = exports.EVENT_STUDENT_CREATED = exports.studentSearchableFields = exports.studentFilterableFields = exports.gender = exports.bloodGroup = void 0;
exports.bloodGroup = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
];
exports.gender = ['male', 'female'];
exports.studentFilterableFields = [
    'searchTerm',
    'firstName',
    'middleName',
    'lastName',
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];
exports.studentSearchableFields = [
    'firstName',
    'middleName',
    'lastName',
    'id',
    'email',
    'contactNo',
];
exports.EVENT_STUDENT_CREATED = 'student.created';
exports.EVENT_STUDENT_UPDATED = 'student.updated';
exports.EVENT_STUDENT_DELETED = 'student.deleted';
