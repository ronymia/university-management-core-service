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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const faculty_constant_1 = require("./faculty.constant");
const createFaculty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.faculty.create({
        data: payload,
        include: {
            academicDepartment: true,
            academicFaculty: true,
        },
    });
    return result;
});
const getSingleFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.faculty.findUnique({
        where: { id },
    });
    return result;
});
const getAllFaculties = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: faculty_constant_1.facultySearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // field Filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    const result = yield prisma_1.prisma.faculty.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
            courses: {
                include: {
                    course: true,
                },
            },
            academicDepartment: true,
            academicFaculty: true,
            offeredCourseClassSchedules: true,
        },
    });
    const total = yield prisma_1.prisma.faculty.count();
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.faculty.count({
        where: whereCondition,
    });
    const totalPages = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            skip,
            total,
            totalPages,
            paginationTotal,
        },
        data: result,
    };
});
const updateFaculty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.faculty.findUnique({
        where: { facultyId: id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found');
    }
    // Update the faulty
    const result = yield prisma_1.prisma.faculty.update({
        where: { facultyId: id },
        data: payload,
        include: {
            academicFaculty: true,
            academicDepartment: true,
        },
    });
    return result;
});
const deleteFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.faculty.findUnique({
        where: { facultyId: id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found');
    }
    const result = yield prisma_1.prisma.faculty.delete({
        where: { facultyId: id },
    });
    return result;
});
// ASSIGN COURSES
const assignCourses = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.courseFaculty.createMany({
        data: payload.map(courseId => ({
            facultyId: id,
            courseId,
        })),
        skipDuplicates: true, // 🔥 Prevents error on duplicate (composite key)
    });
    const assignedCourses = yield prisma_1.prisma.courseFaculty.findMany({
        where: {
            AND: [
                {
                    facultyId: id,
                },
                {
                    courseId: {
                        in: payload,
                    },
                },
            ],
        },
        include: {
            course: true,
        },
    });
    // RETURN
    return assignedCourses;
});
// REMOVE COURSES
const removeCourses = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // REMOVE COURSES
    yield prisma_1.prisma.courseFaculty.deleteMany({
        where: {
            AND: [
                {
                    facultyId: id,
                },
                {
                    courseId: {
                        in: payload,
                    },
                },
            ],
        },
    });
    // GET ASSIGNED COURSES
    const assignedCourses = yield prisma_1.prisma.courseFaculty.findMany({
        where: {
            AND: [
                {
                    facultyId: id,
                },
            ],
        },
        include: {
            faculty: true,
        },
    });
    // RETURN
    return assignedCourses;
});
// MY COURSES
const myCourses = (authUser, filter) => __awaiter(void 0, void 0, void 0, function* () {
    if (!filter.academicSemesterId) {
        const currentSemester = yield prisma_1.prisma.academicSemester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        filter.academicSemesterId = currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.id;
    }
    const offeredCourseSections = yield prisma_1.prisma.offeredCourseSection.findMany({
        where: {
            offeredCourseClassSchedules: {
                some: {
                    faculty: {
                        facultyId: authUser.userId,
                    },
                },
            },
            offeredCourse: {
                semesterRegistration: {
                    academicSemester: {
                        id: filter.academicSemesterId,
                    },
                },
            },
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true,
                        },
                    },
                },
            },
        },
    });
    const courseAndSchedule = offeredCourseSections.reduce((acc, obj) => {
        //console.log(obj)
        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules;
        const existingCourse = acc.find((item) => { var _a; return ((_a = item.course) === null || _a === void 0 ? void 0 : _a.id) === (course === null || course === void 0 ? void 0 : course.id); });
        if (existingCourse) {
            existingCourse.sections.push({
                section: obj,
                classSchedules,
            });
        }
        else {
            acc.push({
                course,
                sections: [
                    {
                        section: obj,
                        classSchedules,
                    },
                ],
            });
        }
        return acc;
    }, []);
    return courseAndSchedule;
});
const getMyCourseStudents = (filters, options, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // console.log(authUser);
    if (!filters.academicSemesterId) {
        const currentAcademicSemester = yield prisma_1.prisma.academicSemester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        if (currentAcademicSemester) {
            filters.academicSemesterId = currentAcademicSemester.id;
        }
    }
    const offeredCourseSections = yield prisma_1.prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
        include: {
            student: true,
        },
        take: limit,
        skip,
    });
    const students = offeredCourseSections.map(offeredCourseSection => offeredCourseSection.student);
    const total = yield prisma_1.prisma.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
    });
    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = yield prisma_1.prisma.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
    });
    const totalPages = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            skip,
            total,
            totalPages,
            paginationTotal,
        },
        data: students,
    };
});
// CREATE FACULTY FROM EVENT
const createFacultyFromEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield createFaculty(event);
});
// UPDATE FACULTY FROM EVENT
const updateFacultyFromEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield updateFaculty(event.facultyId, event);
});
// UPDATE FACULTY FROM EVENT
const deleteFacultyFromEvent = (facultyId) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteFaculty(facultyId);
});
// EXPORT SERVICES
exports.FacultyService = {
    createFaculty,
    getAllFaculties,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty,
    assignCourses,
    removeCourses,
    myCourses,
    getMyCourseStudents,
    createFacultyFromEvent,
    updateFacultyFromEvent,
    deleteFacultyFromEvent,
};
