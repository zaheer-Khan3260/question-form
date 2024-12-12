import Question from '../models/questions.models.js';
import { Form } from '../models/form.models.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from '../config/cloudinary.config.js';

export const createQuestion = asyncHandler(async (req, res, next) => {
  const { formId, type, content, points, formAccessKey } = req.body;
  

  if (!formId) {
    throw new ApiError('Form ID is required.', 400);
  }

  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError('Form not found. Please provide a valid form ID.', 404);
  }

  
  if (!type || !['Categorize', 'Cloze', 'Comprehension'].includes(type)) {
    throw new ApiError('Invalid or missing question type.', 400);
  }

  if (!content || typeof content !== 'object') {
    throw new ApiError('Content must be a valid object.', 400);
  }

  
  switch (type) {
    case 'Categorize':
      if (!Array.isArray(content.categories) || !Array.isArray(content.items)) {
        throw new ApiError('Categorize content must include "categories" and "items" as arrays.', 400);
      }
      break;
    case 'Cloze':
      if (!content.passage || typeof content.passage !== 'string' || !Array.isArray(content.blanks)) {
         throw new ApiError('Cloze content must include "passage" as a string and "blanks" as an array.', 400);
      }
      break;
    case 'Comprehension':
      if (!content.passage || typeof content.passage !== 'string' || !Array.isArray(content.questions)) {
         throw new ApiError('Comprehension content must include "passage" as a string and "questions" as an array.', 400);
      }
      break;
    default:
      throw new ApiError('Unsupported question type.', 400);
  }

  const imageLocalFilePath = req.file?.path;
  let uploadedImage;
  if(imageLocalFilePath){
    image = uploadOnCloudinary(imageLocalFilePath);
  }
  
  const newQuestion = new Question({
    type,
    content,
    points: points || 1, 
    image: uploadedImage.url,
    formAccessKey
  });

  const savedQuestion = await newQuestion.save();

  return res.status(201).json( 
    new ApiResponse(
    201,
    'Question created successfully.',
    savedQuestion,
  )
);
});

export const updateQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { type, content, points } = req.body;
  
    if (!questionId) {
      throw new ApiError('Question ID is required.', 400);
    }
  
    const question = await Question.findById(questionId);
    if (!question) {
      throw new ApiError('Question not found. Please provide a valid question ID.', 404);
    }
  
    if (type && !['Categorize', 'Cloze', 'Comprehension'].includes(type)) {
      throw new ApiError('Invalid question type.', 400);
    }
  
    if (content && typeof content !== 'object') {
      throw new ApiError('Content must be a valid object.', 400);
    }
  
    if (type || content) {
      const updatedType = type || question.type;
      const updatedContent = content || question.content;
  
      switch (updatedType) {
        case 'Categorize':
          if (!Array.isArray(updatedContent.categories) || !Array.isArray(updatedContent.items)) {
            throw new ApiError('Categorize content must include "categories" and "items" as arrays.', 400);
          }
          break;
        case 'Cloze':
          if (!updatedContent.passage || typeof updatedContent.passage !== 'string' || !Array.isArray(updatedContent.blanks)) {
            throw new ApiError('Cloze content must include "passage" as a string and "blanks" as an array.', 400);
          }
          break;
        case 'Comprehension':
          if (!updatedContent.passage || typeof updatedContent.passage !== 'string' || !Array.isArray(updatedContent.questions)) {
            throw new ApiError('Comprehension content must include "passage" as a string and "questions" as an array.', 400);
          }
          break;
        default:
          throw new ApiError('Unsupported question type.', 400);
      }
  
      question.type = updatedType;
      question.content = updatedContent;
    }
  
    if (points !== undefined) {
      question.points = points;
    }
  
    if (req.file) {
      const imageLocalFilePath = req.file.path;
      const uploadedImage = await uploadOnCloudinary(imageLocalFilePath);
      question.image = uploadedImage.url;
    }
  
    const updatedQuestion = await question.save();
  
    return res.status(200).json(
      new ApiResponse(
        200,
        'Question updated successfully.',
        updatedQuestion,
      )
    );
  });

  export const deleteQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
  
    if (!questionId) {
      throw new ApiError('Question ID is required.', 400);
    }
  
    const question = await Question.findById(questionId);
    if (!question) {
      throw new ApiError('Question not found. Please provide a valid question ID.', 404);
    }
  
    await question.remove();
  
    return res.status(200).json(
      new ApiResponse(
        200,
        'Question deleted successfully.',
        null,
      )
    );
  });
  
  