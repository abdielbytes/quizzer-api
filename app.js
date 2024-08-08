const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:8080', // Allow requests only from this origin
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Allow specific headers
};

// Enable CORS with options
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
