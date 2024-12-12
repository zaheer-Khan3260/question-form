import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    questionTitle: {
      type: String
    },
    formAccessKey: {
      type: String,
      required: [true, 'Form ID is required'], 
    },
    type: {
      type: String,
      enum: {
        values: ['Categorize', 'Cloze', 'Comprehension'],
        message: 'Invalid question type',
      },
      required: [true, 'Question type is required'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Question content is required'],
      validate: {
        validator: function (v) {
          if (typeof v !== 'object' || v === null) return false;
          switch (this.type) {
            case 'Categorize':
              return v.categories && Array.isArray(v.categories) && v.items && Array.isArray(v.items);
            case 'Cloze':
              return v.sentence && typeof v.sentence === 'string' && v.blanks && Array.isArray(v.blanks);
            case 'Comprehension':
              return v.passage && typeof v.passage === 'string' && v.questions && Array.isArray(v.questions);
            default:
              return false;
          }
        },
        message: (props) => `Invalid content for question type: ${props.value}`,
      },
    },
    points: {
      type: Number,
      default: 1,
      min: [0, 'Points cannot be negative'],
      max: [10, 'Maximum points per question is 10'],
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid image URL',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Question', QuestionSchema);
