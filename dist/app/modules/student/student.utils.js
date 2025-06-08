"use strict";
// STUDENT
// export const findLastStudentId = async (): Promise<string | undefined> => {
//   const lastStudent = await User.findOne(
//     { role: ENUM_USER_ROLE.STUDENT },
//     { id: 1, _id: 0 }
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
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
exports.StudentUtils = void 0;
//   return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
// };
// export const generateStudentId = async (
//   academicSemester: AcademicSemester | null
// ): Promise<string> => {
//   const currentId =
//     (await findLastStudentId()) || (0).toString().padStart(5, '0'); //00000
//   //increment by 1
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
//   incrementedId = `${academicSemester?.year.substring(2)}${
//     academicSemester?.code
//   }${incrementedId}`;
//   return incrementedId;
// };
const getAvailableCourses = (offeredCourses, studentCompletedCourses, studentCurrentlyTakenCourses) => __awaiter(void 0, void 0, void 0, function* () {
    const completedCourseIds = studentCompletedCourses.map((completedCourse) => completedCourse.courseId);
    const availableCourses = offeredCourses
        .filter((course) => !completedCourseIds.includes(course.id))
        .filter((course) => {
        const preRequisiteCourses = course.course.preRequisiteCourses || [];
        if (preRequisiteCourses.length === 0) {
            return true; // No prerequisites, course is available
        }
        else {
            const preRequisiteCourseIds = preRequisiteCourses.map((preRequisiteCourse) => preRequisiteCourse.preRequisiteId);
            return preRequisiteCourseIds.every((id) => completedCourseIds.includes(id));
        }
    })
        .map((course) => {
        const isAlreadyTaken = studentCurrentlyTakenCourses.find((c) => c.offeredCourseId === course.id);
        if (isAlreadyTaken) {
            course.offeredCourseSections.map((section) => {
                if (section.id === isAlreadyTaken.offeredCourseSectionId) {
                    section.isTaken = true;
                }
                else {
                    section.isTaken = false;
                }
            });
            return Object.assign(Object.assign({}, course), { isTaken: true });
        }
        else {
            course.offeredCourseSections.map((section) => {
                section.isTaken = false;
            });
            return Object.assign(Object.assign({}, course), { isTaken: false });
        }
    });
    return availableCourses;
});
const groupByAcademicSemester = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const groupedData = data.reduce((result, course) => {
        const academicSemester = course.academicSemester;
        const academicSemesterId = academicSemester.id;
        const existingGroup = result.find((group) => group.academicSemester.id === academicSemesterId);
        if (existingGroup) {
            existingGroup.completedCourse.push({
                id: course.id,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                courseId: course.courseId,
                studentId: course.studentId,
                grade: course.grade,
                point: course.point,
                totalMarks: course.totalMarks,
                course: course.course,
            });
        }
        else {
            result.push({
                academicSemester,
                completedCourse: [
                    {
                        id: course.id,
                        createdAt: course.createdAt,
                        updatedAt: course.updatedAt,
                        courseId: course.courseId,
                        studentId: course.studentId,
                        grade: course.grade,
                        point: course.point,
                        totalMarks: course.totalMarks,
                        course: course.course,
                    },
                ],
            });
        }
        return result;
    }, []);
    return groupedData;
});
exports.StudentUtils = {
    getAvailableCourses,
    groupByAcademicSemester,
};
