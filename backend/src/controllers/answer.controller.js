import Answer from '../models/answer.model.js';
import Question from '../models/questions.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createAnswer = async (req, res) => {
  try {
    const { questionId, formAccessKey, type, content } = req.body;

    if (!questionId || !formAccessKey || !type || !content) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (question.formAccessKey !== formAccessKey) {
      return res.status(400).json({ message: 'Invalid form access key.' });
    }

    if (question.type !== type) {
      return res.status(400).json({
        message: `Answer type (${type}) does not match question type (${question.type}).`,
      });
    }

    const validateContent = (type, content) => {
      switch (type) {
        case 'Categorize':
          return (
            content.categories &&
            Array.isArray(content.categories) &&
            content.categories.every(
              (category) => category.items && Array.isArray(category.items)
            )
          );
        case 'Cloze':
          return (
            content.answers &&
            Array.isArray(content.answers) &&
            content.answers.every((answer) => typeof answer === 'string')
          );
        case 'Comprehension':
          return (
            content.answers           
          );
        default:
          return false;
      }
    };

    if (!validateContent(type, content)) {
      return res.status(400).json({
        message: `Invalid content structure for answer type: ${type}.`,
      });
    }

    const answer = new Answer({
      questionId,
      formAccessKey,
      type,
      content,
    });

    // Save the answer to the database
    await answer.save();

    return res.status(201).json( new ApiResponse(
      201, 
      'Answer created successfully.',
       answer,
    ));
  } catch (error) {
    console.error('Error creating answer:', error);
    return res.status(500).json({
      message: 'An error occurred while creating the answer.',
      error: error.message,
    });
  }
};
