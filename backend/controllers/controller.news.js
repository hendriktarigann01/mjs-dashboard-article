const News = require("../models/model.news.js");
const { cloudinary, uploadToCloudinary } = require("../lib/cloudinary.js");
const { generateSlug } = require("../lib/slug.js");

// GET /api/news/get-news?status=draft|published
exports.getAllNews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const news = await News.find(filter).sort({ created_at: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/news/get-news/:id
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/news/slug/:slug — hanya ambil data, view tracking via event-based
exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/news/create-news  (multipart/form-data)
exports.createNews = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer, "mjs/news");
        uploadedUrls.push(uploaded.secure_url);
      }
    }

    const slug = generateSlug(title);

    const news = new News({
      title,
      slug,
      description,
      image_news: uploadedUrls,
      status: status || "draft",
    });

    const saved = await news.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error:
          "Judul terlalu mirip dengan artikel yang sudah ada, mohon gunakan judul yang berbeda.",
      });
    }
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/news/update-news/:id  (multipart/form-data)
exports.updateNewsById = async (req, res) => {
  try {
    const existing = await News.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "News not found" });

    const { slug: _slug, ...bodyWithoutSlug } = req.body;
    const updateData = { ...bodyWithoutSlug, updated_at: Date.now() };

    if (updateData.title && updateData.title !== existing.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    if (req.files && req.files.length > 0) {
      if (existing.image_news && existing.image_news.length > 0) {
        for (const url of existing.image_news) {
          const publicId = url.split("/").slice(-2).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }
      const uploadedUrls = [];
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer, "mjs/news");
        uploadedUrls.push(uploaded.secure_url);
      }
      updateData.image_news = uploadedUrls;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/news/delete-news/:id
exports.deleteNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    // Hapus semua gambar dari Cloudinary
    if (news.image_news && news.image_news.length > 0) {
      for (const url of news.image_news) {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/news/publish/:id
exports.publishNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { status: "published", updated_at: Date.now() },
      { new: true },
    );
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/news/view/:id — track view per IP per hari
exports.trackView = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const today = new Date().toISOString().slice(0, 10); // "2025-03-04"
    const key = `${ip}_${today}`;

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    if (!news.views_log.includes(key)) {
      news.views += 1;
      news.views_log.push(key);
      await news.save();
    }

    res.json({ views: news.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/news/top-views — 3 news published dengan views tertinggi
exports.getTopViews = async (req, res) => {
  try {
    const news = await News.find({ status: "published" })
      .sort({ views: -1 })
      .limit(3);
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/news/view/slug/:slug — event-based tracking (scroll 80% atau time >10s)
exports.trackViewBySlug = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const today = new Date().toISOString().slice(0, 10);
    const key = `${ip}_${today}`;

    const news = await News.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ error: "News not found" });

    if (!news.views_log.includes(key)) {
      news.views += 1;
      news.views_log.push(key);
      await news.save();
    }

    res.json({ views: news.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
