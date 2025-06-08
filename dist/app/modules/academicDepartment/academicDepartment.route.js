"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicDepartment_controller_1 = require("./academicDepartment.controller");
const academicDepartment_validation_1 = require("./academicDepartment.validation");
const router = express_1.default.Router();
// create
/**
 * Create a new Academic Department.
 *
 * @openapi
 * /academic-departments:
 *   post:
 *     summary: Create a new Academic Department
 *     tags: [Academic Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the Academic Department
 *                 example: Department of Computer Science
 *               academicFacultyId:
 *                 type: string
 *                 description: The ID of the Academic Faculty
 *                 example: 1
 *     responses:
 *       201:
 *         description: The created Academic Department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created Academic Department
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the created Academic Department
 *                   example: Department of Computer Science
 *                 academicFacultyId:
 *                   type: string
 *                   description: The ID of the Academic Faculty
 *                   example: 1
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicDepartment_validation_1.AcademicDepartmentValidation.createZodSchema), academicDepartment_controller_1.AcademicDepartmentController.createAcademicDepartment);
/**
 * @swagger
 * /academic-departments:
 *   get:
 *     summary: Get all Academic Departments
 *     description: Returns all Academic Departments
 *     tags:
 *       - Academic Departments
 *     responses:
 *       200:
 *         description: A list of Academic Departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicDepartment'
 */
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), academicDepartment_controller_1.AcademicDepartmentController.getAllAcademicDepartments);
// GET BY ID
/**
 * @swagger
 * /academic-departments/{id}:
 *   get:
 *     summary: Get a single Academic Department by ID
 *     description: Retrieve a single Academic Department using its unique ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Academic Department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicDepartment'
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), academicDepartment_controller_1.AcademicDepartmentController.getSingleAcademicDepartment);
// UPDATE
/**
 * @swagger
 * /academic-departments/{id}:
 *   patch:
 *     summary: Update an Academic Department
 *     description: Update details of an existing Academic Department by its ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicDepartment'
 *     responses:
 *       200:
 *         description: Academic Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicDepartment'
 */
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicDepartment_validation_1.AcademicDepartmentValidation.updateZodSchema), academicDepartment_controller_1.AcademicDepartmentController.updateAcademicDepartment);
// DELETE
/**
 * Delete an Academic Department by its ID.
 *
 * @openapi
 * /academic-departments/{id}:
 *   delete:
 *     summary: Delete an Academic Department
 *     description: Delete an existing Academic Department by its ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic Department deleted successfully
 */
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicDepartment_controller_1.AcademicDepartmentController.deleteAcademicDepartment);
exports.AcademicDepartmentRoutes = router;
