const express = require("express");
const { handleAnalyze } = require("../controllers/analyze.controller");
const { validateUrl } = require("../middlewares/validateUrl.middleware");
const { rateLimiter } = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.get("/analyze", rateLimiter, validateUrl, handleAnalyze);

module.exports = router;
