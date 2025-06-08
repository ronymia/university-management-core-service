"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const router = express_1.default.Router();
// CREATE
/**
 * Create a new Academic Faculty.
 *
 * @openapi
 * /academic-faculties:
 *   post:
 *     summary: Create a new Academic Faculty
 *     description: This endpoint creates a new Academic Faculty.
 *     tags:
 *       - Academic Faculties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicFaculty'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.createAcademicFacultyZodSchema), academicFaculty_controller_1.AcademicFacultyController.createAcademicFaculty);
// GET ALL
/**
 * @swagger
 * /academic-faculties:
 *   get:
 *     summary: Get all Academic Faculties
 *     description: Returns all Academic Faculties
 *     tags:
 *       - Academic Faculties
 *     responses:
 *       200:
 *         description: A list of Academic Faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicFaculty'
 */
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), academicFaculty_controller_1.AcademicFacultyController.getAllAcademicFaculties);
// GET BY ID
/**
 * @swagger
 * /academic-faculties/{id}:
 *   get:
 *     summary: Get a single Academic Faculty by ID
 *     description: Retrieve a single Academic Faculty using its unique ID.
 *     tags:
 *       - Academic Faculties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Faculty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Academic Faculty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), academicFaculty_controller_1.AcademicFacultyController.getSingleAcademicFaculty);
// UPDATE
/**
 * @swagger
 * /academic-faculties/{id}:
 *   patch:
 *     summary: Update an Academic Faculty
 *     description: Update details of an existing Academic Faculty by its ID.
 *     tags:
 *       - Academic Faculties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Faculty
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicFaculty'
 *     responses:
 *       200:
 *         description: Academic Faculty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicFaculty_validation_1.AcademicFacultyValidation.updateAcademicFacultyZodSchema), academicFaculty_controller_1.AcademicFacultyController.updateAcademicFaculty);
// DELETE
/**
 * Deletes an Academic Faculty by its ID.
 *
 * @param {string} id - The unique ID of the Academic Faculty
 * @returns {Promise<void>}
 */
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicFaculty_controller_1.AcademicFacultyController.deleteAcademicFaculty);
exports.AcademicFacultyRoutes = router;
