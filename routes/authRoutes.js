const express = require('express');
const userRoutes = express.Router();
const User = require('../models/user');
const { pageLogin, loginLogic, register, registerLogic, logout } = require('../controllers/authControllers');

//* Router for login
userRoutes.get('/login', pageLogin);

//* Login Logic
userRoutes.post('/login', loginLogic);

//* Route for register page
userRoutes.get('/register', register);

//* Register Logic
userRoutes.post('/register', registerLogic);

//* Route for Logout
userRoutes.get('/logout', logout);

module.exports = userRoutes;