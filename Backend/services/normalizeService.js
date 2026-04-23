function normalizeData(ga, behavior, clarity) {
  const totalTime = behavior.avgSessionDuration || 0;
const sessions = ga.sessions || 1;

const avgTime = sessions > 0 ? totalTime / sessions : 0;
  return {
    date: new Date(),

    activeUsers: ga.activeUsers || 0,
    totalUsers: ga.totalUsers || 0,
    sessions: ga.sessions || 0,
    pageViews: ga.pageViews || 0,
    bounceRate: ga.bounceRate || 0,

   avgSessionDuration: Math.round(avgTime),
    behaviorBounceRate: behavior.bounceRate || 0,

    clicks: (clarity.rageClicks || 0) + (clarity.deadClicks || 0),
    scrollDepth: clarity.scrollDepth || 0,
    recordings: clarity.recordings || 0,
    heatmaps: clarity.heatmaps || 0
  };
}

module.exports = { normalizeData };