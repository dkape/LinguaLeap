
const express = require('express');
const router = express.Router();
const learningPathsController = require('../controllers/learning-paths');
const auth = require('../middleware/auth');

router.post('/', auth, learningPathsController.createLearningPath);

module.exports = router;
