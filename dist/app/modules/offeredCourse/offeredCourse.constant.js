"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_OFFERED_COURSE_DELETED = exports.EVENT_OFFERED_COURSE_UPDATED = exports.EVENT_OFFERED_COURSE_CREATED = exports.offeredCourseFilterableFields = exports.offeredCourseSearchableFields = void 0;
exports.offeredCourseSearchableFields = [
    'courseId',
    'semesterRegistrationId',
    'academicDepartmentId',
];
exports.offeredCourseFilterableFields = [
    'searchTerm',
    'courseId',
    'semesterRegistrationId',
    'academicDepartmentId',
];
exports.EVENT_OFFERED_COURSE_CREATED = 'offered-course.created';
exports.EVENT_OFFERED_COURSE_UPDATED = 'offered-course.updated';
exports.EVENT_OFFERED_COURSE_DELETED = 'offered-course.deleted';
