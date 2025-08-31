const express = require("express");
const commentRoutes = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");
const { addComment, getCommentForm, updateComment, deleteComment } = require("../controllers/commentControllers");

//! Comment Routes 
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

//! Get Comments
commentRoutes.get('/comments/:id/edit', getCommentForm); 

//! Route for update comment
commentRoutes.put('/comments/:id', ensureAuthenticated, updateComment);

//! Delete Comment 
commentRoutes.delete('/comments/:id', ensureAuthenticated, deleteComment);

module.exports = commentRoutes;
