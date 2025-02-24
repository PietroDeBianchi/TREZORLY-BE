
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const routes = require('../routes/index.js')

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.enable('trust proxy');

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({ credentials: true, origin: true }));

// mount api v1 routes
app.use('/api', routes);

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack); // Log
    res.status(err.status || 500).json({
        message: err.message || 'Errore interno del server',
        status: err.status || 500
    });
})

module.exports = app;
