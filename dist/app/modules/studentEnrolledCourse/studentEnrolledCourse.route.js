"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const studentEnrolledCourse_controller_1 = require("./studentEnrolledCourse.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const studentEnrolledCourse_validation_1 = require("./studentEnrolledCourse.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourse_controller_1.StudentEnrolledCourseController.getAllStudentEnrolledCourse);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourse_controller_1.StudentEnrolledCourseController.getSingleStudentEnrolledCourse);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), (0, validateRequest_1.default)(studentEnrolledCourse_validation_1.studentEnrolledCourseValidation.updateStudentEnrolledCourseSchema), studentEnrolledCourse_controller_1.StudentEnrolledCourseController.updateStudentEnrolledCourse);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourse_controller_1.StudentEnrolledCourseController.deleteStudentEnrolledCourse);
// EXPORT
exports.StudentEnrolledCourseRoutes = router;
