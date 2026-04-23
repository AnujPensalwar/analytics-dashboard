const db = require("../db");
const { fetchGAData, fetchBehaviorData } = require("../services/gaService");
const { fetchClarityData } = require("../services/clarityService");
const { normalizeData } = require("../services/normalizeService");



exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const gaData = await fetchGAData(startDate, endDate);
    const behaviorData = await fetchBehaviorData(startDate, endDate);
    const clarityData = await fetchClarityData();
    const finalData = normalizeData(gaData, behaviorData, clarityData);

    // 1. GA Metrics
    db.query(
      `INSERT INTO ga_metrics 
      (date, active_users, total_users, sessions, page_views, bounce_rate)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        finalData.date,
        finalData.activeUsers,
        finalData.totalUsers,
        finalData.sessions,
        finalData.pageViews,
        finalData.bounceRate
      ],
      (err) => {
        if (err) return res.status(500).json(err);

        // 2. GA Behavior
        db.query(
          `INSERT INTO ga_behavior 
          (date, avg_session_duration, bounce_rate)
          VALUES (?, ?, ?)`,
          [
            finalData.date,
            finalData.avgSessionDuration,
            finalData.behaviorBounceRate
          ],
          (err) => {
            if (err) return res.status(500).json(err);

            // 3. Clarity
             if (
      clarityData &&
      (clarityData.scrollDepth !== 0 || clarityData.clicks !== 0)
    ) {
      db.query(
              `INSERT INTO clarity_metrics 
              (date, clicks, scroll_depth, recordings, heatmaps)
              VALUES (?, ?, ?, ?, ?)`,
              [
                finalData.date,
                finalData.clicks,
                finalData.scrollDepth,
                finalData.recordings,
                finalData.heatmaps
              ],
              (err) => {
                if (err) return res.status(500).json(err);

                res.json({
                  message: "Data stored successfully",
                  finalData
                });
              }
            );
          }
        }
        );
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};



// ======================================================
// 🔹 DASHBOARD (GA TABLE DATA)
// ======================================================
exports.getDashboard = (req, res) => {
  const { startDate, endDate } = req.query;

  const today = new Date();
const last7Days = new Date();
last7Days.setDate(today.getDate() - 7);

const start = startDate 
  ? startDate + " 00:00:00"
  : "2000-01-01 00:00:00";

const end = endDate 
  ? endDate + " 23:59:59"
  : "2100-01-01 23:59:59";

  db.query(
    `SELECT DATE(date) as date,
            total_users as users,
            sessions,
            page_views as views,
            bounce_rate as bounce
     FROM ga_metrics
     WHERE date BETWEEN ? AND ?
     ORDER BY id ASC`,
    [start, end],
    (err, gaRows) => {
      if (err) return res.status(500).json(err);

      res.json({
        tableData: gaRows
      });
    }
  );
};



// ======================================================
// 🔹 BEHAVIOR (GA BEHAVIOR)
// ======================================================
exports.getBehavior = (req, res) => {
  db.query(
    `SELECT avg_session_duration, bounce_rate
     FROM ga_behavior
     ORDER BY id DESC LIMIT 1`,
    (err, behaviorRows) => {
      if (err) return res.status(500).json(err);

      res.json({
        behaviorInsights: {
          sessionDuration: behaviorRows[0]?.avg_session_duration || 0,
          bounceRate: behaviorRows[0]?.bounce_rate || 0
        }
      });
    }
  );
};



// ======================================================
// 🔹 CLICKS (CLARITY)
// ======================================================
exports.getClicks = (req, res) => {
  db.query(
    `SELECT clicks, scroll_depth, recordings, heatmaps
     FROM clarity_metrics
     ORDER BY id DESC LIMIT 1`,
    (err, clarityRows) => {
      if (err) return res.status(500).json(err);

      res.json({
        userBehavior: {
          clicks: Number(clarityRows[0]?.clicks || 0),            // 👈 FIX
          scrollDepth: Number(clarityRows[0]?.scroll_depth || 0), // 👈 FIX
          recordings: Number(clarityRows[0]?.recordings || 0),
          heatmaps: Number(clarityRows[0]?.heatmaps || 0)
        }
      });
    }
  );
};

