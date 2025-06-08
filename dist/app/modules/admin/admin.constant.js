"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ADMIN_CREATED = exports.adminSearchableFields = exports.adminFilterableFields = void 0;
exports.adminFilterableFields = [
    'searchTerm',
    'id',
    'bloodGroup',
    'email',
    'contactNo',
    'emergencyContactNo',
    'managementDepartment',
    'designation',
];
exports.adminSearchableFields = [
    'email',
    'contactNo',
    'emergencyContactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
];
exports.EVENT_ADMIN_CREATED = 'admin.created';
