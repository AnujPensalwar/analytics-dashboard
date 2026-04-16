const axios = require("axios");

const API_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4M0FCMDhFNUYwRDMxNjdEOTRFMTQ3M0FEQTk2RTcyRDkwRUYwRkYiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiJlMjViMmRlYi1hMTI5LTRhMGEtYmUwZS1jZTcxYjZmODkzMWYiLCJzdWIiOiIzMjgzMDYxNDI3MDkxNzg4Iiwic2NvcGUiOiJEYXRhLkV4cG9ydCIsIm5iZiI6MTc3NjIwMTUyNCwiZXhwIjo0OTI5ODAxNTI0LCJpYXQiOjE3NzYyMDE1MjQsImlzcyI6ImNsYXJpdHkiLCJhdWQiOiJjbGFyaXR5LmRhdGEtZXhwb3J0ZXIifQ.c60LhrrwPkji8S-fWf4y_AzGLGG8SGziwMGw1P7ueG8GtU6zIVi7TpanZhgoKPVb5i5gkvnhw91_39ZQNZ-qFGmUUUJfOnhOfhsCSLwk5lz9jOFrdXQs3bvdSsysAAt-o8aJwSNziKqo6DhV1m5mbafnuKQ7M5vjJcR6KubcT_H5_kTrUT1mkxbkP5UMV318d449gbJp_qc4wn0Oe7xmqchvVIj8so2b2Em717fA2XyhPMP0stvPNNSmafTaXheDC-dOyxGzxkuZc3GTdGG7pYOKFMxs2AXST5iCkx58FApAjhZg6gNfBZzog8sAx9ox2nBj3R7ulRM7erMTeDPQpQ";
const PROJECT_ID = "wbqxljk11o";

async function fetchClarityData() {
  try {
    const response = await axios.get(
      "https://www.clarity.ms/export-data/api/v1/project-live-insights",
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        params: {
          projectId: PROJECT_ID,
        },
      }
    );

    const data = response.data;

    return {
      users: data.totalUsers || 0,
      sessions: data.totalSessions || 0,
      pageViews: data.pageViews || 0,
      bounceRate: data.bounceRate || 0,
      clicks: data.totalClicks || 0,
      scrollDepth: data.avgScrollDepth || 0,
    };
  } catch (error) {
    console.error("Clarity API Error:", error.message);
    return {
      users: 0,
      sessions: 0,
      pageViews: 0,
      bounceRate: 0,
      clicks: 0,
      scrollDepth: 0,
    };
  }
}

module.exports = { fetchClarityData };