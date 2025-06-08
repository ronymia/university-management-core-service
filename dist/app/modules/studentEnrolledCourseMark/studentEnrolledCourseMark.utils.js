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
exports.StudentEnrolledCourseMarkUtils = void 0;
// CALCULATE GRADE FROM MARK
const getGradeFromMark = (mark) => __awaiter(void 0, void 0, void 0, function* () {
    // DEFINE GRADE
    const result = {
        grade: '',
        points: 0,
    };
    if (mark && mark >= 80 && mark <= 100) {
        result.grade = 'A+';
        result.points = 4.0;
    }
    else if (mark && mark >= 70 && mark <= 79) {
        result.grade = 'A';
        result.points = 3.5;
    }
    else if (mark && mark >= 60 && mark <= 69) {
        result.grade = 'A-';
        result.points = 3.0;
    }
    else if (mark && mark >= 50 && mark <= 59) {
        result.grade = 'B';
        result.points = 2.5;
    }
    else if (mark && mark >= 40 && mark <= 49) {
        result.grade = 'C';
        result.points = 2.0;
    }
    else if (mark && mark >= 33 && mark <= 39) {
        result.grade = 'D';
        result.points = 2.0;
    }
    else {
        result.grade = 'F';
        result.points = 0.0;
    }
    return result;
});
//
const calcGradeAndCGPA = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.length === 0) {
        return {
            cgpa: 0,
            totalCreditCompleted: 0,
        };
    }
    let totalCreditCompleted = 0;
    let totalPoints = 0;
    for (const item of payload) {
        totalCreditCompleted += item.course.credits || 0;
        totalPoints += item.points || 0;
    }
    const cgpa = Number((totalPoints / payload.length).toFixed(2));
    return {
        cgpa,
        totalCreditCompleted,
    };
});
// EXPORT GRADE FUNCTION
exports.StudentEnrolledCourseMarkUtils = {
    getGradeFromMark,
    calcGradeAndCGPA,
};
