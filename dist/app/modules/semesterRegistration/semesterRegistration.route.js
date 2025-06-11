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
// Student self-service routes
router.get('/get-my-registration', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getMyRegistration);
router.get('/get-my-semester-courses', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getMySemesterRegCourses);
router.post('/start-registration', (0, auth_1.default)(user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.startMyRegistration);
router.post('/confirm-my-registration', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.confirmMyRegistration);
// Enrollment routes
router.post('/enrolled-into-semester', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.enrollIntoSemesterRegistration);
router.post('/enrolled-into-course', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.enrollIntoCourse);
router.post('/withdraw-from-enrolled-course', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.STUDENT), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.withdrawFromEnrolledCourse);
// Admin routes
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.createZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.createSemesterRegistration);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getAllSemesterRegistration);
router.post('/:id/start-new-semester', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.startNewSemester);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY, user_1.ENUM_USER_ROLE.STUDENT), semesterRegistration_controller_1.SemesterRegistrationController.getSingleSemesterRegistration)
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.updateZodSchema), semesterRegistration_controller_1.SemesterRegistrationController.updateSemesterRegistration)
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.deleteSemesterRegistration);
// EXPORT
exports.SemesterRegistrationRoutes = router;
