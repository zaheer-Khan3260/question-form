import { body, validationResult } from 'express-validator';

export const formValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Form title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  
  body('questions.*.type')
    .isIn(['Categorize', 'Cloze', 'Comprehension'])
    .withMessage('Invalid question type'),
  
  body('questions.*.content')
    .notEmpty()
    .withMessage('Question content is required')
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array() 
    });
  }
  next();
};