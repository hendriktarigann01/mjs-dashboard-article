const News = require("../models/model.news.js");
const Project = require("../models/model.project.js");

// GET /api/stats — total publish & total views gabungan News + Project
exports.getStats = async (req, res) => {
  try {
    const [newsStats, projectStats] = await Promise.all([
      News.aggregate([
        {
          $group: {
            _id: null,
            totalPublished: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            totalViews: { $sum: "$views" },
          },
        },
      ]),
      Project.aggregate([
        {
          $group: {
            _id: null,
            totalPublished: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            totalViews: { $sum: "$views" },
          },
        },
      ]),
    ]);

    const newsData = newsStats[0] || { totalPublished: 0, totalViews: 0 };
    const projectData = projectStats[0] || { totalPublished: 0, totalViews: 0 };

    res.json({
      totalPublished: newsData.totalPublished + projectData.totalPublished,
      totalViews: newsData.totalViews + projectData.totalViews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/stats/chart?period=years|months|days
exports.getChartStats = async (req, res) => {
  try {
    const { period = "years" } = req.query;
    const now = new Date();

    let labels = [];
    let matchNews = {};
    let matchProjects = {};
    let groupId = {};

    if (period === "years") {
      // months in the current year (Jan - Dec)
      const year = now.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);

      matchNews = { created_at: { $gte: startOfYear, $lte: endOfYear } };
      matchProjects = { created_at: { $gte: startOfYear, $lte: endOfYear } };
      groupId = { month: { $month: "$created_at" } };

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      labels = monthNames.map((m) => `${m} - ${year}`);
    } else if (period === "months") {
      // every day of the month
      const year = now.getFullYear();
      const month = now.getMonth();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
      const daysInMonth = endOfMonth.getDate();

      matchNews = { created_at: { $gte: startOfMonth, $lte: endOfMonth } };
      matchProjects = { created_at: { $gte: startOfMonth, $lte: endOfMonth } };
      groupId = { day: { $dayOfMonth: "$created_at" } };

      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    } else if (period === "days") {
      // last 7 days (rolling week)
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      matchNews = { created_at: { $gte: sevenDaysAgo, $lte: now } };
      matchProjects = { created_at: { $gte: sevenDaysAgo, $lte: now } };
      groupId = {
        year: { $year: "$created_at" },
        month: { $month: "$created_at" },
        day: { $dayOfMonth: "$created_at" },
      };

      const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        return dayNames[d.getDay()];
      });
    }

    // Aggregate news
    const newsAgg = await require("../models/model.news.js").aggregate([
      { $match: matchNews },
      { $group: { _id: groupId, count: { $sum: 1 } } },
    ]);

    // Aggregate projects
    const projectsAgg = await require("../models/model.project.js").aggregate([
      { $match: matchProjects },
      { $group: { _id: groupId, count: { $sum: 1 } } },
    ]);

    const buildData = (agg) => {
      const map = {};
      agg.forEach((item) => {
        let key;
        if (period === "years")
          key = item._id.month - 1; // 0-based monthly index
        else if (period === "months") key = item._id.day - 1;
        else if (period === "days") {
          // Search index based on relative date from sevenDaysAgo
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);
          const itemDate = new Date(
            item._id.year,
            item._id.month - 1,
            item._id.day,
          );
          const diffMs = itemDate - sevenDaysAgo;
          key = Math.round(diffMs / (1000 * 60 * 60 * 24));
        }
        if (key !== undefined && key >= 0 && key < labels.length) {
          map[key] = item.count;
        }
      });
      return labels.map((_, i) => map[i] || 0);
    };

    res.json({
      labels,
      projects: buildData(projectsAgg),
      news: buildData(newsAgg),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
