"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const academicDepartment_route_1 = require("../modules/academicDepartment/academicDepartment.route");
const academicFaculty_route_1 = require("../modules/academicFaculty/academicFaculty.route");
const academicSemester_route_1 = require("../modules/academicSemester/academicSemester.route");
const admin_route_1 = require("../modules/admin/admin.route");
const building_route_1 = require("../modules/building/building.route");
const course_route_1 = require("../modules/course/course.route");
const faculty_route_1 = require("../modules/faculty/faculty.route");
const offeredCourse_route_1 = require("../modules/offeredCourse/offeredCourse.route");
const offeredCourseClassSchedule_route_1 = require("../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.route");
const offeredCourseSection_route_1 = require("../modules/offeredCourseSection/offeredCourseSection.route");
const room_route_1 = require("../modules/room/room.route");
const semesterRegistration_route_1 = require("../modules/semesterRegistration/semesterRegistration.route");
const student_route_1 = require("../modules/student/student.route");
const studentEnrolledCourseMark_route_1 = require("../modules/studentEnrolledCourseMark/studentEnrolledCourseMark.route");
const studentEnrolledCourse_route_1 = require("../modules/studentEnrolledCourse/studentEnrolledCourse.route");
const studentSemesterPayment_route_1 = require("../modules/studentSemesterPayment/studentSemesterPayment.route");
const studentSemesterRegistration_route_1 = require("../modules/studentSemesterRegistration/studentSemesterRegistration.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/academic-semesters',
        route: academicSemester_route_1.AcademicSemesterRoutes,
    },
    {
        path: '/academic-faculties',
        route: academicFaculty_route_1.AcademicFacultyRoutes,
    },
    // {
    //   path: '/academic-faculties/',
    //   route: AcademicFacultyRoutes,
    // },
    {
        path: '/academic-departments/',
        route: academicDepartment_route_1.AcademicDepartmentRoutes,
    },
    // {
    //   path: '/management-departments/',
    //   route: ManagementDepartmentRoutes,
    // },
    {
        path: '/students/',
        route: student_route_1.StudentRoutes,
    },
    {
        path: '/faculties/',
        route: faculty_route_1.FacultyRoutes,
    },
    {
        path: '/admins/',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/buildings/',
        route: building_route_1.BuildingRoutes,
    },
    {
        path: '/rooms/',
        route: room_route_1.RoomRoutes,
    },
    {
        path: '/courses/',
        route: course_route_1.CourseRoutes,
    },
    {
        path: '/semester-registrations/',
        route: semesterRegistration_route_1.SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses/',
        route: offeredCourse_route_1.OfferedCourseRoutes,
    },
    {
        path: '/offered-course-sections/',
        route: offeredCourseSection_route_1.OfferedCourseSectionRoutes,
    },
    {
        path: '/offered-course-class-schedules/',
        route: offeredCourseClassSchedule_route_1.OfferedCourseClassScheduleRoutes,
    },
    {
        path: '/student-enrolled-courses/',
        route: studentEnrolledCourse_route_1.StudentEnrolledCourseRoutes,
    },
    {
        path: '/semester-payments/',
        route: studentSemesterPayment_route_1.StudentSemesterPaymentRoutes,
    },
    {
        path: '/student-enrolled-course-marks/',
        route: studentEnrolledCourseMark_route_1.StudentEnrolledCourseMarkRoutes,
    },
    {
        path: '/student-semester-registrations/',
        route: studentSemesterRegistration_route_1.StudentSemesterRegistrationRoutes,
    },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
