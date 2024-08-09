const express = require('express');
const { createQuiz, getQuizzes, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);

module.exports = router;
