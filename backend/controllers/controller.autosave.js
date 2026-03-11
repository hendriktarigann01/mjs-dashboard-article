const redis = require("../lib/redis.js");

const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const buildKey = (userId, type) => `autosave:${userId}:${type}`;

// POST /api/autosave/:type
exports.saveAutosave = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { type } = req.params;

    if (!["news", "project"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const key = buildKey(userId, type);

    await redis.set(key, JSON.stringify(req.body), { EX: TTL_SECONDS });

    return res.json({ message: "Autosave saved" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Autosave failed", error: err.message });
  }
};

// GET /api/autosave/:type
exports.getAutosave = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { type } = req.params;

    if (!["news", "project"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const key = buildKey(userId, type);
    const data = await redis.get(key);

    return res.json({ data: data ? JSON.parse(data) : null });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Get autosave failed", error: err.message });
  }
};

// DELETE /api/autosave/:type
exports.clearAutosave = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { type } = req.params;

    const key = buildKey(userId, type);
    await redis.del(key);

    return res.json({ message: "Autosave cleared" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Clear autosave failed", error: err.message });
  }
};
