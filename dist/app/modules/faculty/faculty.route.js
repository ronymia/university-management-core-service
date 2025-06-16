"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_controller_1 = require("./faculty.controller");
const faculty_validation_1 = require("./faculty.validation");
const router = express_1.default.Router();
router
    .route('/my-courses')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), faculty_controller_1.FacultyController.myCourses);
router.get('/my-course-students', (0, auth_1.default)(user_1.ENUM_USER_ROLE.FACULTY), faculty_controller_1.FacultyController.getMyCourseStudents);
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), faculty_controller_1.FacultyController.getAllFaculties);
/**
 * GET /faculties/:id
 * Retrieve a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to retrieve
 *
 * @returns {Promise<void>}
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), faculty_controller_1.FacultyController.getSingleFaculty);
/**
 * @swagger
 * /faculties:
 *   post:
 *     summary: Create a new Faculty
 *     description: This endpoint creates a new Faculty.
 *     tags:
 *       - Faculties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Faculty'
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(faculty_validation_1.FacultyValidation.updateFacultyZodSchema), faculty_controller_1.FacultyController.createFaculty);
/**
 * PATCH /faculties/:id
 * Update a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to update
 *
 * @returns {Promise<void>}
 */
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), (0, validateRequest_1.default)(faculty_validation_1.FacultyValidation.updateFacultyZodSchema), faculty_controller_1.FacultyController.updateFaculty);
/**
 * DELETE /faculties/:id
 * Delete a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to delete
 *
 * @returns {Promise<void>}
 */
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), faculty_controller_1.FacultyController.deleteFaculty);
/**
 * POST /faculties/:id/assigned-courses
 * Assign courses to a Faculty
 *
 * @param {string} id - The ID of the Faculty to assign courses to
 *
 * @param {string[]} courseIds - The IDs of the courses to assign
 *
 * @returns {Promise<void>}
 */
router
    .route('/:id/assigned-courses')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(faculty_validation_1.FacultyValidation.assignOrRemoveCoursesSchema), faculty_controller_1.FacultyController.assignCourses);
/**
 * DELETE /faculties/:id/remove-courses
 * Remove courses from a Faculty
 *
 * @param {string} id - The ID of the Faculty to remove courses from
 *
 * @param {string[]} courseIds - The IDs of the courses to remove
 *
 * @returns {Promise<void>}
 */
router
    .route('/:id/remove-courses')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(faculty_validation_1.FacultyValidation.assignOrRemoveCoursesSchema), faculty_controller_1.FacultyController.removeCourses);
exports.FacultyRoutes = router;
