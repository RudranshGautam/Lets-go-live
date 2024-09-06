// server.js
require('dotenv').config(); // Load .env file
const express = require('express');
const helmet = require('./middleware/helmetConfig');
const errorLogger = require('./middleware/errorLogger');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet); // Helmet for security
app.use(errorLogger); // Error logging

// Create a write stream for logging requests
const logStream = fs.createWriteStream(path.join(__dirname, process.env.LOG_FILE), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
