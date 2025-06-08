"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStartTimeBeforeEndTime = exports.isEndTimeAfterStartTime = exports.timeToDate = void 0;
const regex_1 = require("./regex");
// convert time to date
function timeToDate(time) {
    if (!(0, regex_1.isValidTime)(time))
        return null;
    return new Date(`1970-01-01T${time}:00`);
}
exports.timeToDate = timeToDate;
// check if end time is after start time
function isEndTimeAfterStartTime({ startTime, endTime, }) {
    const start = timeToDate(startTime);
    const end = timeToDate(endTime);
    if (!start || !end)
        return false; // Invalid input
    return end > start;
}
exports.isEndTimeAfterStartTime = isEndTimeAfterStartTime;
function isStartTimeBeforeEndTime({ startTime, endTime, }) {
    const start = timeToDate(startTime);
    const end = timeToDate(endTime);
    if (!start || !end)
        return false; // Invalid input
    return end >= start;
}
exports.isStartTimeBeforeEndTime = isStartTimeBeforeEndTime;
