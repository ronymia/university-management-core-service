"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourseClassSchedule_controller_1 = require("./offeredCourseClassSchedule.controller");
const offeredCourseClassSchedule_validation_1 = require("./offeredCourseClassSchedule.validation");
const router = express_1.default.Router();
/**
 * @openapi
 * /offered-course-ClassSchedules:
 *   post:
 *     summary: Create a new Offered Course ClassSchedule
 *     description: This endpoint creates a new Offered Course ClassSchedule.
 *     tags:
 *       - Offered Course ClassSchedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourseClassSchedule'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseClassSchedule'
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(offeredCourseClassSchedule_validation_1.OfferedCourseClassScheduleValidation.createOfferedCourseClassScheduleZodValidation), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleControllers.createOfferedCourseClassSchedule);
/**
 * @openapi
 * /offered-course-ClassSchedules/{id}:
 *   get:
 *     summary: Get a single Offered Course ClassSchedule
 *     description: This endpoint retrieves a single Offered Course ClassSchedule by its ID.
 *     tags:
 *       - Offered Course ClassSchedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course ClassSchedule
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseClassSchedule'
 */
/**
 * Get a single Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @returns {Promise<OfferedCourseClassSchedule>} - The Offered Course ClassSchedule
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleControllers.getSingleOfferedCourseClassSchedule);
/**
 * @openapi
 * /offered-course-ClassSchedules:
 *   get:
 *     summary: Get all Offered Course ClassSchedules
 *     description: This endpoint retrieves all Offered Course ClassSchedules.
 *     tags:
 *       - Offered Course ClassSchedules
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfferedCourseClassSchedule'
 */
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleControllers.getAllOfferedCourseClassSchedules);
/**
 * Update an Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @param {OfferedCourseClassSchedule} payload - The updated Offered Course ClassSchedule
 * @returns {Promise<OfferedCourseClassSchedule>} - The updated Offered Course ClassSchedule
 */
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(offeredCourseClassSchedule_validation_1.OfferedCourseClassScheduleValidation.updateOfferedCourseClassScheduleZodValidation), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleControllers.updateOfferedCourseClassSchedule);
/**
 * Delete an Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @returns {Promise<void>} - Promise that resolves when the Offered Course ClassSchedule is deleted
 */
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), offeredCourseClassSchedule_controller_1.OfferedCourseClassScheduleControllers.deleteOfferedCourseClassSchedule);
//   EXPORT
exports.OfferedCourseClassScheduleRoutes = router;
