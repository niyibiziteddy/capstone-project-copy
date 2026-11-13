import express from 'express';
import { getStudents, addStudent, getStudentById, updateStudent, deleteStudent } from '../controllers/index.js';
import { getStudentsValidator, addStudentValidator, updateStudentValidator, deleteStudentValidator } from '../validators/index.js';

const router = express.Router();

router.get('/', getStudentsValidator, getStudents);
router.post('/', addStudentValidator, addStudent);
router.get('/:id', getStudentById);
router.put('/:id', updateStudentValidator, updateStudent);
router.delete('/:id', deleteStudentValidator, deleteStudent);

export default router;
