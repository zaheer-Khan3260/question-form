import express from 'express';
import { upload } from '../middleware/multer.middleware.js'; 
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/question.controller.js';

const router = express.Router();

router.post('/', upload.single('questionImage'), createQuestion);

router.patch('/:questionId', upload.single('questionImage'), updateQuestion);

router.delete('/:questionId', deleteQuestion);

export default router;
