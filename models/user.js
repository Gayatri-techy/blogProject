const mongoose = require("mongoose");

// UserSchema Creation
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  profilePicture: { type: Object, public_id: String, url: String},
  bio: { type: String, max: 200 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
},
    {
        timestamps: true,
    }
);


// Model Creation
const User = mongoose.model('User', userSchema);

module.exports = User;