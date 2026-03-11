const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  image_news: [{ type: String }],
  views: { type: Number, default: 0 },
  views_log: [{ type: String }],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const News = mongoose.model("News", NewsSchema);
module.exports = News;
