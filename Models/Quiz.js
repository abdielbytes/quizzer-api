// models/Quiz.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          optionText: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
        },
      ],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Quiz', QuizSchema);
