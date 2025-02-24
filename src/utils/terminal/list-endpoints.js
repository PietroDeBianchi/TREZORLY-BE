// Configured Express instance
const app = require('../../config/express.js');

// Log all API endpoints to the console for debugging
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));