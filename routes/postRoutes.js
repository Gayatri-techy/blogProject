const express = require('express');
const { getPostForm, createPost, getPosts, getPostById, getEditPost, updatePost, deletePost } = require('../controllers/postControllers');
const postRoutes = express.Router();
const upload = require('../config/multer');
const { ensureAuthenticated } = require('../middlewares/auth');

postRoutes.get('/add', getPostForm);

// Post Logic with File upload
postRoutes.post('/add', ensureAuthenticated, upload.array('images', 5) ,createPost);

// For Get all Posts
postRoutes.get('/', getPosts);

// For Get Post by ID
postRoutes.get('/:id', getPostById);

// For Editing the post already given /posts 
postRoutes.get('/:id/edit', getEditPost);

// This is the route for updating the post
postRoutes.put('/:id', ensureAuthenticated, upload.array('images', 5), updatePost);

// This is the route for deleting the post
postRoutes.delete('/:id', ensureAuthenticated, deletePost); 

module.exports = postRoutes;