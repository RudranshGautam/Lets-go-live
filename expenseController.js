// controllers/expenseController.js
const Expense = require('../models/expenseModel'); // Assuming you have a model for Expense

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

// Add more methods for creating, deleting, and updating expenses
