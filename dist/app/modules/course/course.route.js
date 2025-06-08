"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const router = express_1.default.Router();
/**
 * POST /courses
 * Create a new course
 *
 * Request Body:
 *   {
 *     title: string,
 *     code: string,
 *     credits: number,
 *     preRequisiteCourses: [{ courseId: string }]
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidations.createSchema), course_controller_1.CourseControllers.createCourse);
/**
 * GET /courses
 * Retrieve all courses
 *
 * Query Params:
 *   searchTerm: string - Search term to filter courses
 *   id: string - Filter courses by ID
 *   code: string - Filter courses by code
 *   name: string - Filter courses by name
 *   limit: number - Limit the number of courses returned
 *   page: number - Page number for pagination
 *
 * Only accessible by Super Admins and Admins
 */
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), course_controller_1.CourseControllers.getAllCourse);
/**
 * GET /courses/:id
 * Retrieve a course by ID
 *
 * URL Params:
 *   id: string - The ID of the course to retrieve
 *
 * Only accessible by Super Admins and Admins
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), course_controller_1.CourseControllers.getCourseById);
/**
 * PATCH /courses/:id
 * Update a course
 *
 * URL Params:
 *   id: string - The ID of the course to update
 *
 * Request Body:
 *   {
 *     title: string,
 *     code: string,
 *     credits: number,
 *     preRequisiteCourses: [{ courseId: string }]
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
// UPDATE
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), course_controller_1.CourseControllers.updateCourse);
/**
 * DELETE /courses/:ids
 * Delete courses by IDs
 *
 * URL Params:
 *   ids: string - The IDs of the courses to delete, separated by commas
 *
 * Only accessible by Super Admins and Admins
 */
router
    .route('/:ids')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), course_controller_1.CourseControllers.deleteCourse);
/**
 * POST /courses/:id/assigned-faculties
 * Assign or remove faculties from a course
 *
 * URL Params:
 *   id: string - The ID of the course to assign or remove faculties from
 *
 * Request Body:
 *   {
 *     facultyIds: string[] - The IDs of the faculties to assign or remove
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
// ASSIGN FACULTIES
router
    .route('/:id/assigned-faculties')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidations.assignOrRemoveFacultiesSchema), course_controller_1.CourseControllers.assignFaculties);
//
/**
 * POST /courses/:id/remove-faculties
 * Remove faculties from a course
 *
 * URL Params:
 *   id: string - The ID of the course to remove faculties from
 *
 * Request Body:
 *   {
 *     facultyIds: string[] - The IDs of the faculties to remove
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
router
    .route('/:id/remove-faculties')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidations.assignOrRemoveFacultiesSchema), course_controller_1.CourseControllers.removeFaculties);
exports.CourseRoutes = router;
