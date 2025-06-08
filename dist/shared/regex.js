"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = exports.isValidTime = void 0;
function isValidTime(time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
}
exports.isValidTime = isValidTime;
function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}
exports.isValidDate = isValidDate;
