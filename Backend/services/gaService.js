const { google } = require("googleapis");

const KEYFILEPATH = "./config/ga-key.json";
const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const propertyId = "533615610";

// GA Metrics
async function fetchGAData(startDate, endDate) {
  const client = google.analyticsdata({ version: "v1beta", auth });

  const res = await client.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{
        startDate: startDate || "7daysAgo",
        endDate: endDate || "today"
      }],
      metrics: [
        { name: "activeUsers" },
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" }
      ]
    }
  });

  const m = res.data.rows?.[0]?.metricValues || [];

  return {
    activeUsers: Number(m[0]?.value || 0),
    totalUsers: Number(m[1]?.value || 0),
    sessions: Number(m[2]?.value || 0),
    pageViews: Number(m[3]?.value || 0),
    bounceRate: Number(m[4]?.value || 0)*100,
  };
}

// GA Behavior
async function fetchBehaviorData(startDate, endDate) {
  const client = google.analyticsdata({ version: "v1beta", auth });

  const res = await client.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{
        startDate: startDate || "7daysAgo",
        endDate: endDate || "today"
      }],
      metrics: [
        { name: "userEngagementDuration" }, 
        { name: "bounceRate" }
      ]
    }
  });

  // console.log("GA BEHAVIOR RAW:", JSON.stringify(res.data, null, 2));
const m = res.data.rows?.[0]?.metricValues || [];
  return {
    avgSessionDuration: Number(m[0]?.value || 0),
    bounceRate: Number(m[1]?.value || 0)
  };
}

module.exports = { fetchGAData, fetchBehaviorData };