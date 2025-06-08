"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../../../shared/redis");
const admin_constant_1 = require("./admin.constant");
const admin_service_1 = require("./admin.service");
const initAdminEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE ADMIN FROM EVENT
    yield redis_1.RedisClient.subscribe(admin_constant_1.EVENT_ADMIN_CREATED, (event) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = JSON.parse(event);
        const adminData = {
            adminId: admin.id,
            firstName: admin.name.firstName,
            middleName: admin.name.middleName,
            lastName: admin.name.lastName,
            email: admin.email,
            gender: admin.gender,
            bloodGroup: admin.bloodGroup,
            contactNo: admin.contactNo,
        };
        yield admin_service_1.AdminService.createAdminFromEvent(adminData);
    }));
});
exports.default = initAdminEvent;
