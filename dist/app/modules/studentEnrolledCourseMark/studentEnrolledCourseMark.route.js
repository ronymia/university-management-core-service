"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseMarkRoutes = void 0;
const express_1 = __importDefault(require("express"));
const studentEnrolledCourseMark_controller_1 = require("./studentEnrolledCourseMark.controller");
const studentEnrolledCourseMark_validation_1 = require("./studentEnrolledCourseMark.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMark);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkController.getSingleStudentEnrolledCourseMark);
router
    .route('/update-marks')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), (0, validateRequest_1.default)(studentEnrolledCourseMark_validation_1.StudentEnrolledCourseMarkValidation.updateStudentEnrolledCourseMarkZodSchema), studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkController.updateStudentEnrolledCourseMark);
router.route('/update-final-marks').patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), 
// validateRequest(
//   StudentEnrolledCourseMarkValidation.updateStudentEnrolledCourseMarkZodSchema
// ),
studentEnrolledCourseMark_controller_1.StudentEnrolledCourseMarkController.updateStudentFinalMark);
exports.StudentEnrolledCourseMarkRoutes = router;
