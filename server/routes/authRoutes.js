const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/signup', authController.register);
router.post('/logout', authController.logout);
router.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = router;