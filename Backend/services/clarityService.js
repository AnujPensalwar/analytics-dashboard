const axios = require("axios");

const API_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ4M0FCMDhFNUYwRDMxNjdEOTRFMTQ3M0FEQTk2RTcyRDkwRUYwRkYiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI5MDdhYTY0ZC03NTE2LTRiZjAtYjU0Yy1jYzk0YTI4ZmZmOTkiLCJzdWIiOiIzMjkxNjI2MDAzNjQ1NDEwIiwic2NvcGUiOiJEYXRhLkV4cG9ydCIsIm5iZiI6MTc3NjcxMTU4NSwiZXhwIjo0OTMwMzExNTg1LCJpYXQiOjE3NzY3MTE1ODUsImlzcyI6ImNsYXJpdHkiLCJhdWQiOiJjbGFyaXR5LmRhdGEtZXhwb3J0ZXIifQ.P-JkeL1pEXZOk5BRV0nqMIPBr9B5p44A6SWi2-4ZNa5QIo46SamKg0Qv4VjmWg5CgTo9NNsGbrLtMctrvhOwYzIpjBTZdjEbZ0GxB230-ppAVa_yFzECe1SSGZAF-R7OiQdkuWKwZovhNASK3Gmao5NA-4w5TJEheHVTAuIyosme4hw4a2AfX5ucAD_p2xMg7P7hbK2yy3KvTtc2J4DQ1iH5Y-CibPLKB5i7_amf6Klg_h4i2d0NIWmPDPDjULm9iR1e7-_guFOwVD6qy8oS_1ICMek8aV3iv-fDQSRilC9QXR6RK4g1bXfmS7V52mUrNBX36IsP7IDysxXwysnfhQ";
const PROJECT_ID = "wes83zb00y";

async function fetchClarityData() {
  console.log("CLARITY API CALLED");
  try {
    const res = await axios.get(
      "https://www.clarity.ms/export-data/api/v1/project-live-insights",
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`
        },
        params: { projectId: PROJECT_ID }
      }
    );


    // console.log("CLARITY FULL:", JSON.stringify(res.data, null, 2));
    const data = res.data;
    
    const scrollObj = data.find(m => m.metricName === "ScrollDepth");
    const rageObj = data.find(m => m.metricName === "RageClickCount");
    const deadObj = data.find(m => m.metricName === "DeadClickCount");

    return {
     scrollDepth: Number(scrollObj?.information?.[0]?.averageScrollDepth || 0),
     rageClicks: Number(rageObj?.information?.[0]?.subTotal || 0),
     deadClicks: Number(deadObj?.information?.[0]?.subTotal || 0),

      recordings: 0,
      heatmaps: 0
    };

  } catch (err) {
    console.error("Clarity Error:", err.message);

    return {
      scrollDepth: 0,
      rageClicks: 0,
      deadClicks: 0,
      recordings: 0,
      heatmaps: 0
    };
  }
}

module.exports = { fetchClarityData };