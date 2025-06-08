"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSemesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const studentSemesterRegistration_controller_1 = require("./studentSemesterRegistration.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const studentSemesterRegistration_validation_1 = require("./studentSemesterRegistration.validation");
const router = express_1.default.Router();
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(studentSemesterRegistration_validation_1.StudentSemesterRegistrationValidation.updateStudentSemesterRegistrationZodSchema), studentSemesterRegistration_controller_1.StudentSemesterRegistrationController.updatedStudentSemesterRegistration)
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), studentSemesterRegistration_controller_1.StudentSemesterRegistrationController.deleteStudentSemesterRegistration);
exports.StudentSemesterRegistrationRoutes = router;
