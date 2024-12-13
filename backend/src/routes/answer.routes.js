import express from 'express';
import {
createAnswer
} from '../controllers/answer.controller.js';

const router = express.Router();

router.post('/', createAnswer);

export default router;
