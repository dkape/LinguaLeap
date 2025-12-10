const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievements');
const auth = require('../middleware/auth');

router.get('/', auth, achievementsController.getStudentAchievements);

module.exports = router;
