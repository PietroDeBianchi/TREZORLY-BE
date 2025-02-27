const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoute');
const urlRoute = require('./urlRoute');

//========================================
// AUTH ROUTES
router.use('/v1/auth', authRoutes);
//========================================
// URL ROUTES
router.use('/v1/auth', urlRoute);

module.exports = router;
