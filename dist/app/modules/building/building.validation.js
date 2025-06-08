"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingValidation = void 0;
const zod_1 = require("zod");
const createBuildingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be string',
        }),
    }),
});
const updateBuildingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ invalid_type_error: 'Title must be string' }).optional(),
    }),
});
exports.BuildingValidation = {
    createBuildingZodSchema,
    updateBuildingZodSchema,
};
