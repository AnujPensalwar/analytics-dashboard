const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");

router.get("/fetch", controller.getAnalytics);
router.get("/dashboard", controller.getDashboard);
router.get("/behavior", controller.getBehavior);
router.get("/clicks", controller.getClicks);

module.exports = router;