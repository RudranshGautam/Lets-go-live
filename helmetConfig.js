// middleware/helmetConfig.js
const helmet = require('helmet');

module.exports = helmet({
  contentSecurityPolicy: false, // Adjust settings as needed
  referrerPolicy: { policy: 'no-referrer' },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
});
