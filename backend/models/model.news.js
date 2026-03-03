const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  product: { type: String, required: true },
  placement: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  image_news: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;
