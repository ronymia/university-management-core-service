import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
    AcademicFacultyController.createAcademicFaculty
  )
  .get(AcademicFacultyController.getAllAcademicFaculties);

router.route('/:id').get(AcademicFacultyController.getSingleAcademicFaculty);
// .patch(
//     validateRequest(
//         AcademicFacultyValidation.updateAcademicFacultyZodSchema,
//     ),
//     AcademicFacultyController.updateAcademicFaculty,
// )
// .delete(AcademicFacultyController.deleteAcademicFaculty);

export const AcademicFacultyRoutes = router;
