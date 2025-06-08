"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleValidation = void 0;
const zod_1 = require("zod");
const constants_1 = require("../../../constants");
const dateTime_1 = require("../../../shared/dateTime");
const regex_1 = require("../../../shared/regex");
const createOfferedCourseClassScheduleZodValidation = zod_1.z.object({
    body: zod_1.z
        .object({
        offeredCourseSectionId: zod_1.z
            .string({
            required_error: 'offeredCourseSectionId field is required',
            invalid_type_error: 'Offered Course Section Id must be string',
        })
            .min(1, 'Please Provide Offered Course Section Id'),
        dayOfWeek: zod_1.z.enum(constants_1.weekDays, {
            required_error: 'dayOfWeek field is required',
            // errorMap: () => {
            //   return {
            //     message: `dayOfWeek must be one of the them ${weekDays.join(', ')}`,
            //   };
            // },
            invalid_type_error: `dayOfWeek must be one of the them ${constants_1.weekDays.join(', ')}`,
        }),
        startTime: zod_1.z
            .string({
            required_error: 'startTime field is required',
            invalid_type_error: 'Start Time must be string',
        })
            .min(1, 'Start Time is required')
            .refine(data => {
            return (0, regex_1.isValidTime)(data);
        }, { message: `Invalid Time format, expected format is HH:MM` }),
        endTime: zod_1.z
            .string({
            required_error: 'endTime field is required',
            invalid_type_error: 'End Time must be string',
        })
            .min(1, 'End Time is required')
            .refine(data => {
            return (0, regex_1.isValidTime)(data);
        }, { message: `Invalid Time format, expected format is HH:MM` }),
        roomId: zod_1.z
            .string({
            required_error: 'roomId field is required',
            invalid_type_error: 'Room Id must be string',
        })
            .min(1, 'Room Id is required'),
        facultyId: zod_1.z
            .string({
            required_error: 'facultyId field is required',
            invalid_type_error: 'Faculty Id must be string',
        })
            .min(1, 'Faculty Id is required'),
    })
        .refine(formData => {
        return (0, dateTime_1.isStartTimeBeforeEndTime)({
            startTime: formData.startTime,
            endTime: formData.endTime,
        });
    }, {
        message: ' Start time should be before End time',
        path: ['endTime'],
    }),
});
const updateOfferedCourseClassScheduleZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourseSectionId: zod_1.z
            .string({
            required_error: 'offeredCourseSectionId field is required',
            invalid_type_error: 'Offered Course Section Id must be string',
        })
            .min(1, 'Please Provide Offered Course Section Id')
            .optional(),
        dayOfWeek: zod_1.z
            .enum(constants_1.weekDays, {
            required_error: 'dayOfWeek field is required',
            invalid_type_error: `dayOfWeek must be one of the them ${constants_1.weekDays.join(', ')}`,
        })
            .optional(),
        startTime: zod_1.z
            .string({
            required_error: 'startTime field is required',
            invalid_type_error: 'Start Time must be string',
        })
            .min(1, 'Start Time is required')
            .optional(),
        endTime: zod_1.z
            .string({
            required_error: 'endTime field is required',
            invalid_type_error: 'End Time must be string',
        })
            .min(1, 'End Time is required')
            .optional(),
        roomId: zod_1.z
            .string({
            required_error: 'roomId field is required',
            invalid_type_error: 'Room Id must be string',
        })
            .min(1, 'Room Id is required')
            .optional(),
        facultyId: zod_1.z
            .string({
            required_error: 'facultyId field is required',
            invalid_type_error: 'Faculty Id must be string',
        })
            .min(1, 'Faculty Id is required')
            .optional(),
    }),
});
exports.OfferedCourseClassScheduleValidation = {
    createOfferedCourseClassScheduleZodValidation,
    updateOfferedCourseClassScheduleZodValidation,
};
