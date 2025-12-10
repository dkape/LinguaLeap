
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

router.get('/me', auth, authController.me);
router.put('/language-preference', auth, authController.updateLanguagePreference);

module.exports = router;
