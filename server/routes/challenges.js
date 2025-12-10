const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenges');
const progressController = require('../controllers/challenge-progress');
const auth = require('../middleware/auth');

// Teacher routes
router.post('/', auth, challengeController.createChallenge);
router.get('/teacher', auth, challengeController.getTeacherChallenges);
router.get('/:challengeId/details', auth, challengeController.getChallengeDetails);
router.get('/class/:classId/leaderboard', auth, challengeController.getClassLeaderboard);

// Student routes
router.get('/student', auth, challengeController.getStudentChallenges);
router.post('/:challengeId/start', auth, challengeController.startChallengeAttempt);

// Challenge progress routes
router.get('/attempts/:attemptId', auth, progressController.getChallengeAttempt);
router.post('/attempts/:attemptId/items/:itemId/start-reading', auth, progressController.startReadingItem);
router.post('/attempts/:attemptId/items/:itemId/complete-reading', auth, progressController.completeReadingItem);
router.post('/attempts/:attemptId/items/:itemId/submit-quiz', auth, progressController.submitQuizAnswers);
router.post('/attempts/:attemptId/complete', auth, progressController.completeChallenge);

// Toggle status route
router.patch('/:challengeId/toggle-status', auth, challengeController.toggleChallengeStatus);

// Update route
router.put('/:challengeId', auth, challengeController.updateChallenge);

module.exports = router;