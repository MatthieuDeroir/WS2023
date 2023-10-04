const express = require('express');
const router = express.Router();
const authController = require('../controllers/UserController');

router.post('/auth/signin', authController.signin);
router.post('/auth/signup', authController.signup);

module.exports = router;

