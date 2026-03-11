const Project = require("../models/model.project.js");
const { cloudinary, uploadToCloudinary } = require("../lib/cloudinary.js");
const { generateSlug } = require("../lib/slug.js");

// GET /api/projects/get-project?status=draft|published
exports.getAllProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const projects = await Project.find(filter).sort({ created_at: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/projects/get-project/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/projects/slug/:slug
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/projects/create-project  (multipart/form-data)
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      location,
      product,
      placement,
      size,
      description,
      tags,
      status,
    } = req.body;

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer, "mjs/projects");
        uploadedUrls.push(uploaded.secure_url);
      }
    }

    const slug = generateSlug(title);

    const project = new Project({
      title,
      slug,
      location,
      product,
      placement,
      size,
      description,
      tags: parsedTags,
      image_project: uploadedUrls,
      status: status || "draft",
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error:
          "Judul terlalu mirip dengan project yang sudah ada, mohon gunakan judul yang berbeda.",
      });
    }
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/projects/update-project/:id  (multipart/form-data)
exports.updateProjectById = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Project not found" });

    const { slug: _slug, ...bodyWithoutSlug } = req.body;
    const updateData = { ...bodyWithoutSlug, updated_at: Date.now() };

    if (updateData.tags) {
      try {
        updateData.tags =
          typeof updateData.tags === "string"
            ? JSON.parse(updateData.tags)
            : updateData.tags;
      } catch {
        updateData.tags = [];
      }
    } else {
      delete updateData.tags;
    }

    // Jangan update slug sama sekali jika title tidak berubah
    if (updateData.title && updateData.title !== existing.title) {
      updateData.slug = generateSlug(updateData.title);
    } else {
      delete updateData.slug;
    }

    if (req.files && req.files.length > 0) {
      if (existing.image_project && existing.image_project.length > 0) {
        for (const url of existing.image_project) {
          const publicId = url.split("/").slice(-2).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }
      const uploadedUrls = [];
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer, "mjs/projects");
        uploadedUrls.push(uploaded.secure_url);
      }
      updateData.image_project = uploadedUrls;
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/projects/delete-project/:id
exports.deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.image_project && project.image_project.length > 0) {
      for (const url of project.image_project) {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/projects/publish/:id
exports.publishProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "published", updated_at: Date.now() },
      { new: true },
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/projects/view/:id — track view per IP per hari
exports.trackView = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const today = new Date().toISOString().slice(0, 10);
    const key = `${ip}_${today}`;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!project.views_log.includes(key)) {
      project.views += 1;
      project.views_log.push(key);
      await project.save();
    }

    res.json({ views: project.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
