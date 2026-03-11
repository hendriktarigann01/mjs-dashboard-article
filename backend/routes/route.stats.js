const express = require("express");
const router = express.Router();
const { getStats, getChartStats } = require("../controllers/controller.stats.js");
const authMiddleware = require("../middleware/middleware.auth.js");

router.get("/", authMiddleware, getStats);
router.get("/chart", authMiddleware, getChartStats);

module.exports = router;