const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoute');

//========================================
// AUTH ROUTES
//========================================
router.use('/v1/auth', authRoutes);

module.exports = router;
