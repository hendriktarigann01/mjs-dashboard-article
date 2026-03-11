const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  editProfile,
} = require("../controllers/controller.auth");
const protect = require("../middleware/middleware.auth"); 

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/edit-profile", protect, editProfile); 

module.exports = router;
