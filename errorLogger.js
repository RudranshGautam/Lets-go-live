// middleware/errorLogger.js
const fs = require('fs');
const path = require('path');

module.exports = (err, req, res, next) => {
  const logFile = path.join(__dirname, '../logs/error.log');
  const errorMessage = `[${new Date().toISOString()}] ${err.stack || err.message}\n`;

  // Write the error message to error.log file
  fs.appendFileSync(logFile, errorMessage);

  // Continue to the next middleware
  next(err);
};
