"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseSectionValidation = void 0;
const zod_1 = require("zod");
const regex_1 = require("../../../shared/regex");
const client_1 = require("@prisma/client");
const dateTime_1 = require("../../../shared/dateTime");
const createOfferedCourseSectionZodValidation = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string({
            required_error: 'title field is required',
            invalid_type_error: 'Title must be string',
        })
            .min(1, 'Title is required'),
        maxCapacity: zod_1.z
            .number({
            required_error: 'Max Capacity is required',
            invalid_type_error: 'Max Capacity must be number',
        })
            .nonnegative({
            message: 'Max Capacity must be greater than or equal to 0',
        }),
        offeredCourseId: zod_1.z
            .string({
            required_error: 'offeredCourseId field is required',
            invalid_type_error: 'Offered Course Id must be string',
        })
            .min(1, 'Offered Course Id is required'),
        classSchedules: zod_1.z.array(zod_1.z.object({
            dayOfWeek: zod_1.z.enum(Object.values(client_1.WeekDays), {
                required_error: 'dayOfWeek field is required',
                // errorMap: () => {
                //   return {
                //     message: `dayOfWeek must be one of the them ${weekDays.join(', ')}`,
                //   };
                // },
                invalid_type_error: `dayOfWeek must be one of the them ${Object.values(client_1.WeekDays).join(', ')}`,
            }),
            startTime: zod_1.z
                .string({
                required_error: 'startTime field is required',
                invalid_type_error: 'Start Time must be string',
            })
                .min(1, 'Start Time is required')
                .refine(data => {
                return (0, regex_1.isValidTime)(data);
            }, { message: `Invalid Time format, expected format is HH:mm` }),
            endTime: zod_1.z
                .string({
                required_error: 'endTime field is required',
                invalid_type_error: 'End Time must be string',
            })
                .min(1, 'End Time is required')
                .refine(data => {
                return (0, regex_1.isValidTime)(data);
            }, { message: `Invalid Time format, expected format is HH:mm` }),
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
        })),
    })
        .refine(formData => {
        const classSchedules = formData.classSchedules;
        return classSchedules.every(schedule => (0, dateTime_1.isStartTimeBeforeEndTime)({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
        }));
    }, {
        message: ' Start time should be before End time',
        path: ['endTime'],
    }),
});
const updateOfferedCourseSectionZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'title field is required',
            invalid_type_error: 'Title must be string',
        })
            .min(1, 'Title is required'),
        maxCapacity: zod_1.z
            .number({
            required_error: 'Max Capacity is required',
            invalid_type_error: 'Max Capacity must be number',
        })
            .nonnegative({
            message: 'Max Capacity must be greater than or equal to 0',
        }),
        offeredCourseId: zod_1.z
            .string({
            required_error: 'offeredCourseId field is required',
            invalid_type_error: 'Offered Course Id must be string',
        })
            .min(1, 'Offered Course Id is required'),
        // currentEnrolledStudent: z
        //   .number({
        //     required_error: 'currentEnrolledStudent field is required',
        //     invalid_type_error: 'current Enrolled Student must be number',
        //   })
        //   .nonnegative({
        //     message: 'Max Capacity must be greater than or equal to 0',
        //   }),
        // SemesterRegistrationId: z
        //   .string({
        //     required_error: 'SemesterRegistrationId field is required',
        //     invalid_type_error: 'Semester Registration Id must be string',
        //   })
        //   .min(1, 'Semester Registration Id is required'),
    }),
});
exports.OfferedCourseSectionValidation = {
    createOfferedCourseSectionZodValidation,
    updateOfferedCourseSectionZodValidation,
};
