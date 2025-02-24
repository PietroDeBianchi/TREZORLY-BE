const express = require("express");

const router = express.Router();

const {login, register, me} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

//================================================================================
// AUTH ROUTES
//================================================================================
router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, me);

module.exports = router;
