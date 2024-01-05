const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const AuthController = require('../controllers/authController');
const router = express.Router();

router.post('/login', AuthController.login);
router.get('/profile', authenticate, authorize(['user', 'admin']), AuthController.getProfile);
router.post('/create-user', authenticate, authorize(['admin']), AuthController.createUser);
router.get('/list-users', authenticate, authorize(['admin']), AuthController.listAllUsers);

module.exports = router;