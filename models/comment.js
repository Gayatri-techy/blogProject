const mongoose = require("mongoose");

// UserSchema Creation
const commentSchema = new mongoose.Schema(
  {content: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User",}
  },
  {
    timestamps: true,
  }
);

// Model Creation
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
