const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');
const auth = require('../middleware/auth');

router.get('/teacher/performance', auth, analyticsController.getTeacherPerformance);
router.get('/teacher/analytics', auth, analyticsController.getTeacherAnalytics);
router.get('/leaderboard', auth, analyticsController.getGlobalLeaderboard);

module.exports = router;
