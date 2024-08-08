// routes/quizRoutes.js
const express = require('express');
const { createQuiz, getQuizzes } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getQuizzes).post(protect, createQuiz);

module.exports = router;
