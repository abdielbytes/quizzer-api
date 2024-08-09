const express = require('express');
const { createQuiz, getQuizzes, getQuizById, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.route('/submit').post(submitQuiz); 

module.exports = router;
