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

    const submission = new Submission({
      quiz: quizId,
      userName,
      answers
    });

    await submission.save();

    res.status(201).json({ message: 'Quiz submitted successfully', submission });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
