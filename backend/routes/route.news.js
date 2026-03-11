const express = require("express");
const router = express.Router();
const controllerNews = require("../controllers/controller.news.js");
const { uploadNewsImage } = require("../lib/cloudinary.js");
const authMiddleware = require("../middleware/middleware.auth.js");

router.get("/get-news", controllerNews.getAllNews);
router.get("/get-news/top-views", controllerNews.getTopViews);    // public
router.get("/get-news/:id", controllerNews.getNewsById);
router.get("/:slug", controllerNews.getNewsBySlug);               // public
router.post("/create-news", authMiddleware, uploadNewsImage, controllerNews.createNews);
router.put("/update-news/:id", authMiddleware, uploadNewsImage, controllerNews.updateNewsById);
router.patch("/publish/:id", authMiddleware, controllerNews.publishNews);
router.patch("/view/slug/:slug", controllerNews.trackViewBySlug); // event-based
router.patch("/view/:id", controllerNews.trackView);              // legacy
router.delete("/delete-news/:id", authMiddleware, controllerNews.deleteNewsById);


module.exports = router;