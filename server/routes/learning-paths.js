const express = require('express');
const router = express.Router();
const learningPathsController = require('../controllers/learning-paths');
const auth = require('../middleware/auth');

router.post('/', auth, learningPathsController.createLearningPath);
router.get('/teacher', auth, learningPathsController.getTeacherLearningPaths);

module.exports = router;
