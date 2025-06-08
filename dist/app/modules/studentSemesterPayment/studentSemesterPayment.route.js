"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSemesterPaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const studentSemesterPayment_controller_1 = require("./studentSemesterPayment.controller");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// GET ALL SEMESTER PAYMENT
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentSemesterPayment_controller_1.StudentSemesterPaymentController.getAllSemesterPayment);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentSemesterPayment_controller_1.StudentSemesterPaymentController.getSingleSemesterPayment);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentSemesterPayment_controller_1.StudentSemesterPaymentController.updatedSemesterPayment);
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.FACULTY), studentSemesterPayment_controller_1.StudentSemesterPaymentController.deleteSemesterPayment);
// EXPORT
exports.StudentSemesterPaymentRoutes = router;
