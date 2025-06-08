"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseSectionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourseSection_controller_1 = require("./offeredCourseSection.controller");
const offeredCourseSection_validation_1 = require("./offeredCourseSection.validation");
const router = express_1.default.Router();
/**
 * @openapi
 * /offered-course-sections:
 *   post:
 *     summary: Create a new Offered Course Section
 *     description: This endpoint creates a new Offered Course Section.
 *     tags:
 *       - Offered Course Sections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourseSection'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseSection'
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(offeredCourseSection_validation_1.OfferedCourseSectionValidation.createOfferedCourseSectionZodValidation), offeredCourseSection_controller_1.OfferedCourseSectionControllers.createOfferedCourseSection);
/**
 * @openapi
 * /offered-course-sections/{id}:
 *   get:
 *     summary: Get a single Offered Course Section
 *     description: This endpoint retrieves a single Offered Course Section by its ID.
 *     tags:
 *       - Offered Course Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course Section
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseSection'
 */
/**
 * Get a single Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @returns {Promise<OfferedCourseSection>} - The Offered Course Section
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), offeredCourseSection_controller_1.OfferedCourseSectionControllers.getSingleOfferedCourseSection);
/**
 * @openapi
 * /offered-course-sections:
 *   get:
 *     summary: Get all Offered Course Sections
 *     description: This endpoint retrieves all Offered Course Sections.
 *     tags:
 *       - Offered Course Sections
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfferedCourseSection'
 */
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), offeredCourseSection_controller_1.OfferedCourseSectionControllers.getAllOfferedCourseSections);
/**
 * Update an Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @param {OfferedCourseSection} payload - The updated Offered Course Section
 * @returns {Promise<OfferedCourseSection>} - The updated Offered Course Section
 */
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(offeredCourseSection_validation_1.OfferedCourseSectionValidation.updateOfferedCourseSectionZodValidation), offeredCourseSection_controller_1.OfferedCourseSectionControllers.updateOfferedCourseSection);
/**
 * Delete an Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @returns {Promise<void>} - Promise that resolves when the Offered Course Section is deleted
 */
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), offeredCourseSection_controller_1.OfferedCourseSectionControllers.deleteOfferedCourseSection);
//   EXPORT
exports.OfferedCourseSectionRoutes = router;
