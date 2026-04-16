function normalizeData(ga, clarity) {
  return {
    activeUsers: ga.activeUsers || 0,
    totalUsers: ga.totalUsers || 0,
    sessions: ga.sessions || 0,
    pageViews: ga.pageViews || 0,
    bounceRate: parseFloat(ga.bounceRate || 0),

    
    clicks: clarity.clicks || 0,
    scrollDepth: clarity.scrollDepth || 0,
  };
}

module.exports = { normalizeData };