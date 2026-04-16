const db = require("../db");
const { fetchGAData } = require("../services/gaService");
const { fetchClarityData } = require("../services/clarityService");
const { normalizeData } = require("../services/normalizeService");
const { fetchBehaviorData } = require("../services/gaService");


exports.getAnalytics = async (req, res) => {
  try {
 const { startDate, endDate } = req.query;
    const gaData = await fetchGAData(startDate, endDate);
    const clarityData = await fetchClarityData();
    const behavior = await fetchBehaviorData();
    const finalData = normalizeData(gaData, clarityData);

    const query = `
     INSERT INTO analytics_data 
(date, active_users, total_users, sessions, page_views, bounce_rate, avg_duration, behavior_bounce_rate)
VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?)
    `;

   db.query(
  query,
  [
    finalData.activeUsers,
    finalData.totalUsers,
    finalData.sessions,
    finalData.pageViews,
    finalData.bounceRate,
    behavior.avgSessionDuration,
    behavior.bounceRate
  ],
  (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(finalData);
  }
);

  } catch (err) {
    console.error("ERROR IN CONTROLLER:", err); 
    res.status(500).json(err);
  }
};

exports.getDashboard = (req, res) => {
  const { startDate, endDate } = req.query;

  let query = "SELECT * FROM analytics_data";

  if (startDate && endDate) {
    query += ` WHERE date BETWEEN '${startDate}' AND '${endDate}'`;
  }

  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getBehavior = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await fetchBehaviorData(startDate, endDate);

    res.json(data);

  } catch (err) {
    console.error("ERROR IN CONTROLLER:", err); 
    res.status(500).json(err);
  }
};

exports.getClicks = (req, res) => {
  res.json({
    clicks: 320,
    scrollDepth: 70,
    recordings: 10,
    heatmaps: 5
  });
};