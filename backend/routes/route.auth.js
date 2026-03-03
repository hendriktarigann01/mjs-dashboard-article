const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/controller.auth");

router.post("/login", login);
router.post("/logout", logout); 

module.exports = router;
