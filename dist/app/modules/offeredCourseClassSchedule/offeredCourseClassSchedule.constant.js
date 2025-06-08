"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED = exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED = exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED = exports.offeredCourseClassScheduleFilterableFields = exports.offeredCourseClassScheduleSearchableFields = void 0;
exports.offeredCourseClassScheduleSearchableFields = [
    'dayOfWeek',
    'startTime',
    'endTime',
    'roomId',
    'facultyId',
    'offeredCourseSectionId',
    'semesterRegistrationId',
];
exports.offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'startTime',
    'endTime',
    'roomId',
    'facultyId',
    'offeredCourseSectionId',
    'semesterRegistrationId',
];
exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED = 'offered-course-class-schedule.created';
exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED = 'offered-course-class-schedule.updated';
exports.EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED = 'offered-course-class-schedule.deleted';
