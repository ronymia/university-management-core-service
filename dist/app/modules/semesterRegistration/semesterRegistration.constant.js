"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationStatus = exports.semesterRegistrationNumericFilterableFields = exports.semesterRegistrationFilterableFields = exports.semesterRegistrationSearchableFields = void 0;
const client_1 = require("@prisma/client");
exports.semesterRegistrationSearchableFields = [
    'title',
    'code',
    'startMonth',
    'endMonth',
];
exports.semesterRegistrationFilterableFields = ['searchTerm', 'status', 'startDate', 'endDate', 'minCredit', 'maxCredit'];
exports.semesterRegistrationNumericFilterableFields = ['minCredit', 'maxCredit'];
exports.semesterRegistrationStatus = [
    client_1.SemesterRegistrationStatus.UPCOMING,
    client_1.SemesterRegistrationStatus.ONGOING,
    client_1.SemesterRegistrationStatus.ENDED,
];
