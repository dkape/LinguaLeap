const express = require('express');
const router = express.Router();
const learningPathsController = require('../controllers/learning-paths');
const auth = require('../middleware/auth');

router.post('/', auth, learningPathsController.createLearningPath);
router.get('/teacher', auth, learningPathsController.getTeacherLearningPaths);
router.patch('/:pathId/toggle-status', auth, learningPathsController.toggleLearningPathStatus);
router.put('/:pathId', auth, learningPathsController.updateLearningPath);

module.exports = router;
