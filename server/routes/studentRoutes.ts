import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuthMiddleware);

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
