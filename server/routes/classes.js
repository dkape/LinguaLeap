const express = require('express');
const router = express.Router();
const classController = require('../controllers/classes');
const auth = require('../middleware/auth');

// Teacher routes
router.post('/', auth, classController.createClass);
router.get('/teacher', auth, classController.getTeacherClasses);
router.get('/:classId', auth, classController.getClassDetails);
router.post('/:classId/students', auth, classController.addStudentToClass);
router.delete('/:classId/students/:studentId', auth, classController.removeStudentFromClass);

// Student routes
router.get('/student/my-classes', auth, classController.getStudentClasses);

module.exports = router;