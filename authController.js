// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection'); // Your MySQL connection
require('dotenv').config(); // Load environment variables

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Controller for user signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const [userExists] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the new user into the database
    await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = generateToken(user[0].id);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware for protecting routes that require authentication
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user id to the request object for future use
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Not authorized, invalid token' });
  }
};
