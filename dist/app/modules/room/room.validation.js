"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidation = void 0;
const zod_1 = require("zod");
const createRoomSchema = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string({
            required_error: 'Room Number is required',
            invalid_type_error: 'Room Number must be string',
        }),
        floor: zod_1.z.string({
            required_error: 'Floor is required',
            invalid_type_error: 'Floor must be string',
        }),
    }),
});
const updateRoomZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z
            .string({
            required_error: 'Room Number is required',
            invalid_type_error: 'Room Number must be string',
        })
            .optional(),
        floor: zod_1.z
            .string({
            required_error: 'Floor is required',
            invalid_type_error: 'Floor must be string',
        })
            .optional(),
    }),
});
exports.RoomValidation = {
    createRoomSchema,
    updateRoomZodSchema,
};
