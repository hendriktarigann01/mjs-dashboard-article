const express = require("express");
const router = express.Router();
const controlleerNews = require("../controllers/controller.news.js")

router.get("/get-news/", controlleerNews.getAllNews);
router.get("/get-news/:id", controlleerNews.getNewsById);
router.post("/create-news/", controlleerNews.createNews);
router.put("/update-news/:id", controlleerNews.updateNewsById);
router.delete("/delete-news/:id", controlleerNews.deleteNewsById);

module.exports = router;
