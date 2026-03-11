const express = require("express");
const router = express.Router();
const {
  saveAutosave,
  getAutosave,
  clearAutosave,
} = require("../controllers/controller.autosave.js");
const authMiddleware = require("../middleware/middleware.auth.js");

router.post("/:type", authMiddleware, saveAutosave);
router.get("/:type", authMiddleware, getAutosave);
router.delete("/:type", authMiddleware, clearAutosave);

module.exports = router;
