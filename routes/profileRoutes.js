const express = require('express');
const multer = require('../config/multer');
const profileRoutes = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const { getUserProfile, getEditProfileForm, updateUserProfile, deleteUserProfile } = require('../controllers/profileControllers');

//! Get UserProfile
profileRoutes.get('/profile', ensureAuthenticated, getUserProfile);

//! Edit Profile 
profileRoutes.get('/edit', ensureAuthenticated, getEditProfileForm);

//! Update Profile
profileRoutes.post('/edit', ensureAuthenticated, multer.single('profilePicture'), updateUserProfile);

//! Delete Profile
profileRoutes.post('/delete', ensureAuthenticated, deleteUserProfile);

module.exports = profileRoutes;