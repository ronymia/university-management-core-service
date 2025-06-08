"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_FACULTY_MY_COURSES = exports.EVENT_FACULTY_REMOVED_COURSES = exports.EVENT_FACULTY_ASSIGNED_COURSES = exports.EVENT_FACULTY_DELETED = exports.EVENT_FACULTY_UPDATED = exports.EVENT_FACULTY_CREATED = exports.facultySearchableFields = exports.facultyFilterableFields = exports.designation = exports.gender = exports.bloodGroup = void 0;
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
exports.designation = ['Professor', 'Lecturer'];
exports.facultyFilterableFields = [
    'searchTerm',
    'id',
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];
exports.facultySearchableFields = [
    'firstName',
    'middleName',
    'lastName',
    'id',
    'email',
    'contactNo',
];
exports.EVENT_FACULTY_CREATED = 'faculty.created';
exports.EVENT_FACULTY_UPDATED = 'faculty.updated';
exports.EVENT_FACULTY_DELETED = 'faculty.deleted';
exports.EVENT_FACULTY_ASSIGNED_COURSES = 'faculty.assigned-courses';
exports.EVENT_FACULTY_REMOVED_COURSES = 'faculty.removed-courses';
exports.EVENT_FACULTY_MY_COURSES = 'faculty.my-courses';
