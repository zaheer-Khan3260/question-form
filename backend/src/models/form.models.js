import mongoose from "mongoose"

const FormSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Form title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    accessKey: {
      type: String,
      unique: true
    }
  }, { 
    timestamps: true 
  });
  
  
  export const Form = mongoose.model('Form', FormSchema);