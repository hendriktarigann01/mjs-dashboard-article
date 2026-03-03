const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./lib/db.js");

// Routes
const authRoutes = require("./routes/route.auth.js");
const newsRoutes = require("./routes/route.news.js");
const projectRoutes = require("./routes/route.project.js");

// MiddleWare
const authMiddleware = require("./middleware/middleware.auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api/auth/", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/projects", projectRoutes);

app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome to the dashboard, ${req.user.username}!`,
  });
});

// Run Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDb();
});
