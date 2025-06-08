"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ACADEMIC_SEMESTER_GET_ALL = exports.EVENT_ACADEMIC_SEMESTER_GET_BY_ID = exports.EVENT_ACADEMIC_SEMESTER_DELETED = exports.EVENT_ACADEMIC_SEMESTER_UPDATED = exports.EVENT_ACADEMIC_SEMESTER_CREATED = exports.academicSemesterTitleCodeMapper = exports.academicSemesterFilterRequest = exports.academicSemesterSearchableFields = exports.academicSemesterMonths = exports.academicSemesterCodes = exports.academicSemesterTitles = void 0;
exports.academicSemesterTitles = [
    'Autumn',
    'Fall',
    'Summer',
];
exports.academicSemesterCodes = [
    '01',
    '02',
    '03',
];
exports.academicSemesterMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
exports.academicSemesterSearchableFields = ['title', 'code', 'year'];
exports.academicSemesterFilterRequest = ['searchTerm', 'title', 'code', 'year'];
exports.academicSemesterTitleCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};
exports.EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semesters.created';
exports.EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semesters.updated';
exports.EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semesters.deleted';
exports.EVENT_ACADEMIC_SEMESTER_GET_BY_ID = 'academic-semesters.getById';
exports.EVENT_ACADEMIC_SEMESTER_GET_ALL = 'academic-semesters.getAll';
