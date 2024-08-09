const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');

exports.createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quiz = new Quiz({ title, questions, user: req.user.id });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.submitQuiz = async (req, res) => {
  const { quizId, userName, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;

    const gradedAnswers = answers.map((answer) => {
      const question = quiz.questions.id(answer.questionId);

      if (!question) {
        return { ...answer, correct: false, error: 'Question not found' };
      }

      // Find the selected option
      const selectedOption = question.options.id(answer.selectedOptionId);

      if (!selectedOption) {
        return { ...answer, correct: false, error: 'Option not found' };
      }

      // Check if the selected option is correct
      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) correctCount += 1;

      return {
        ...answer,
        correct: isCorrect,
      };
    });

    const submission = new Submission({
      quiz: quizId,
      userName,
      answers: gradedAnswers,
    });

    await submission.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      submission,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};