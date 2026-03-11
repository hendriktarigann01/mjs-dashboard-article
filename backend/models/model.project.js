const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  location: { type: String, required: true },
  product: { type: String, required: true },
  placement: { type: String, required: true },
  size: { type: String, default: "" },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  image_project: [{ type: String }],
  views: { type: Number, default: 0 },
  views_log: [{ type: String }],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
