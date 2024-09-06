// routes/expenseRoutes.js
const express = require('express');
const { getExpenses } = require('../controllers/expenseController');

const router = express.Router();

router.get('/', getExpenses);

// Add more routes like POST, DELETE, etc.

module.exports = router;
