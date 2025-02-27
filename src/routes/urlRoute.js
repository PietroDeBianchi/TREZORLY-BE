const express = require("express");

const router = express.Router();

const {shortenUrl, redirectUrl, getAnalytics} = require("../controllers/urlController");
const authMiddleware = require("../middleware/authMiddleware");

//================================================================================
// URL ROUTES
//================================================================================
router.post("/shortenUrl", authMiddleware, shortenUrl);
router.post("/redirectUrl", authMiddleware, redirectUrl);
router.post("/getAnalytics", authMiddleware, getAnalytics);

module.exports = router;
