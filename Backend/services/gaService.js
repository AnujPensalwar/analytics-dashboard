const { google } = require("googleapis");

const KEYFILEPATH = "./config/ga-key.json"; 
const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

async function fetchGAData(startDate, endDate) {
  const analyticsDataClient = google.analyticsdata({
    version: "v1beta",
    auth,
  });

  const propertyId = "533063140";

  const response = await analyticsDataClient.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: startDate || "7daysAgo", endDate: endDate || "today" }],
      metrics: [
  { name: "activeUsers" },   
  { name: "totalUsers" },    
  { name: "sessions" },
  { name: "screenPageViews" },
  { name: "bounceRate" },
],
    },
  });

  if (!response.data.rows || response.data.rows.length === 0) {
  return {
    users: 0,
    sessions: 0,
    pageViews: 0,
    bounceRate: 0,
  };
}

const metrics = response.data.rows[0].metricValues;

return {
  activeUsers: parseInt(metrics[0].value || 0),
  totalUsers: parseInt(metrics[1].value || 0),
  sessions: parseInt(metrics[2].value || 0),
  pageViews: parseInt(metrics[3].value || 0),
  bounceRate: parseFloat(metrics[4].value || 0),
};
}


//this for behavior insights
async function fetchBehaviorData(startDate, endDate) {
  const analyticsDataClient = google.analyticsdata({
    version: "v1beta",
    auth,
  });

  const propertyId = "533224129";

  try {
    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{
          startDate: startDate || "7daysAgo",
          endDate: endDate || "today"
        }],
       metrics: [
  { name: "userEngagementDuration" },
  { name: "bounceRate" }
],
      },
    });

  const metrics = response.data.rows?.[0]?.metricValues || [];

const totalEngagement = parseFloat(metrics[0]?.value || 0);
const bounce = parseFloat(metrics[1]?.value || 0) * 100;

return {
  avgSessionDuration: totalEngagement, 
  bounceRate: bounce,
  topPages: []
};

  } catch (err) {
    console.error("Behavior API Error:", err.message);

    return {
      topPages: [],
      bounceRate: 0,
      avgSessionDuration: 0
    };
  }
}

module.exports = { fetchGAData, fetchBehaviorData  };