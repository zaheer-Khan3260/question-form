import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'Question ID is required'],
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
      required: [true, 'Answer type is required'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Answer content is required'],
      validate: {
        validator: function (v) {
          if (typeof v !== 'object' || v === null) return false;
          switch (this.type) {
            case 'Categorize':
              return (
                v.categories &&
                Array.isArray(v.categories) &&
                v.categories.every((category) =>
                  category.items && Array.isArray(category.items)
                )
              );
            case 'Cloze':
              return (
                v.answers &&
                Array.isArray(v.answers) &&
                v.answers.every((answer) => typeof answer === 'string')
              );
            case 'Comprehension':
              return (
                v.answers
              );
            default:
              return false;
          }
        },
        message: (props) => `Invalid content for answer type: ${props.value}`,
      },
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Answer', AnswerSchema);
