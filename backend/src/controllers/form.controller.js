import { Form } from '../models/form.models.js';
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from '../utils/ApiResponse.js';


  
export const createForm = asyncHandler(async (req, res, next) => {
    const { title, questions } = req.body;
  
    if (!title || !questions || !Array.isArray(questions)) {
      return next(new ApiError('Invalid input. Title and questions are required, and questions must be an array.', 400));
    }
  
    const sanitizedTitle = title.trim();
    const newForm = new Form({
      title: sanitizedTitle,
      questions,
      isPublished: true
    });
  
    try {
      const savedForm = await newForm.save();
  
      res.status(201).json({
        status: 'success',
        data: {
          form: savedForm,
          previewLink: `/preview/${savedForm.accessKey}`, 
          accessLink: `${savedForm._id}/${savedForm.accessKey}`
        },
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ApiError('Form validation failed. Please check your input.', 400);
      }
      throw new ApiError('An error occurred while saving the form. Please try again later.', 500);
    }
  });
  

export const getFormByAccessKey = asyncHandler(async (req, res, next) => {
    const { accessKey } = req.params;

    const form = await Form.findOne({ accessKey }).select('-__v');

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { form }
    });
});


 export const updateForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const form = await Form.findById(id);
    
    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    // Check if user is the creator
    if (form.createdBy.toString() !== req.user._id.toString()) {
     throw new ApiError('Not authorized to update this form', 403);
    }

    const updatedForm = await Form.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    return res.status(200).json(
      new ApiResponse(
      200,
      updatedForm 
    )
  );
});

  // Delete form
export const deleteForm = asyncHandler(async (req, res, ) => {
    const { id } = req.params;

    const form = await Form.findById(id);
    
    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    // Check deletion permissions
    if (form.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError('Not authorized to delete this form', 403);
    }

    await Form.findByIdAndDelete(id);

    res.status(204).json((
      204,
      "Form is deleted successfully"
  ));

  });

