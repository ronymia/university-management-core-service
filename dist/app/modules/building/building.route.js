"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const building_controller_1 = require("./building.controller");
const building_validation_1 = require("./building.validation");
const router = express_1.default.Router();
/**
 * Create a new Building.
 *
 * @openapi
 * /buildings:
 *   post:
 *     summary: Create a new Building
 *     description: This endpoint creates a new Building.
 *     tags:
 *       - Buildings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Building'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// CREATE
router
    .route('/')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(building_validation_1.BuildingValidation.createBuildingZodSchema), building_controller_1.BuildingController.createBuilding);
/**
 * Get a single Building by ID.
 *
 * @openapi
 * /buildings/{id}:
 *   get:
 *     summary: Get a single Building by ID
 *     description: Retrieve a single Building using its unique ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Building
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// GET BY ID
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), building_controller_1.BuildingController.getSingleBuilding);
/**
 * Get all Buildings.
 *
 * @openapi
 * /buildings:
 *   get:
 *     summary: Get all Buildings
 *     description: Retrieve all Buildings.
 *     tags:
 *       - Buildings
 *     responses:
 *       200:
 *         description: A list of Buildings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 */
// GET ALL
router
    .route('/')
    .get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), building_controller_1.BuildingController.getAllBuildings);
/**
 * Update an existing Building.
 *
 * @openapi
 * /buildings/{id}:
 *   patch:
 *     summary: Update an existing Building
 *     description: Update details of an existing Building by its ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Building'
 *     responses:
 *       200:
 *         description: Building updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// UPDATE
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(building_validation_1.BuildingValidation.updateBuildingZodSchema), building_controller_1.BuildingController.updateBuilding);
/**
 * Delete an existing Building.
 *
 * @openapi
 * /buildings/{id}:
 *   delete:
 *     summary: Delete an existing Building
 *     description: Delete an existing Building by its ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Building deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Building deleted successfully
 */
// DELETE
router
    .route('/:id')
    .delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), building_controller_1.BuildingController.deleteBuilding);
exports.BuildingRoutes = router;
