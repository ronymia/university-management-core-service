"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const router = express_1.default.Router();
router
    .route('/enrolled-into-semester')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.enrollIntoSemesterRegistration);
router
    .route('/enrolled-into-course')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.enrollIntoCourse);
/**
 * @openapi
 * /semester-registrations:
 *   post:
 *     summary: Create a new Semester Registration
 *     description: This endpoint creates a new Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterRegistration'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.createZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.createSemesterRegistration);
/**
 * @openapi
 * /semester-registrations:
 *   get:
 *     summary: Retrieve all Semester Registrations
 *     description: Retrieve all Semester Registrations.
 *     tags:
 *       - Semester Registrations
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SemesterRegistration'
 */
router.route('/get-my-registration').get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), 
// validateRequest(SemesterRegistrationValidation.createZodSchema),
semesterRegistration_controller_1.SemesterRegistrationController.getMyRegistration);
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getAllSemesterRegistration);
/**
 * @swagger
 * /semester-registrations/{id}:
 *   get:
 *     summary: Retrieve a single Semester Registration by ID
 *     description: Retrieve a single Semester Registration by ID.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getSingleSemesterRegistration);
/**
 * @swagger
 * /semester-registrations/{id}:
 *   patch:
 *     summary: Update a Semester Registration
 *     description: Update a Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterRegistration'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router.route('/confirm-my-registration').patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), 
// validateRequest(SemesterRegistrationValidation.createZodSchema),
semesterRegistration_controller_1.SemesterRegistrationController.confirmMyRegistration);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.updateZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.updateSemesterRegistration);
router.route('/:id/start-new-semester').post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(SemesterRegistrationValidation.updateZodSchema),
semesterRegistration_controller_1.SemesterRegistrationController.startNewSemester);
/**
 * @openapi
 * /semester-registrations/{id}:
 *   delete:
 *     summary: Delete a Semester Registration
 *     description: Delete a Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
    .route('/withdraw-from-enrolled-course')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.withdrawFromEnrolledCourse);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.deleteSemesterRegistration);
// EXPORT
exports.SemesterRegistrationRoutes = router;
