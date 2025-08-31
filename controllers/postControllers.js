const asyncHandler = require("express-async-handler");

const cloudinary = require("../config/cloudinary");
const Post = require("../models/post");
const File = require("../models/file");

//! Rendering post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "",
    error: "",
  });
});

//! Create New Post
// exports.createPost = async (req, res) => {
//   const { title, content } = req.body;
//   console.log(req.files);
//   const newPost = await Post.create({
//     title,
//     content,
//     author: req.user._id,
//   });
//   console.log(newPost);
//   res.redirect("/posts");
// };

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  //* Validation
  // if (!req.files || req.files.length === 0) {
  //   return res.render("newPost.ejs", {
  //     title: "Create Post",
  //     user: req.user,
  //     success: "",
  //     error: "Please add atleast one image",
  //   });
  // }

  const images = await Promise.all(
    req.files.map(async (file) => {
      // console.log(file);
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      // console.log(newFile);
      return { url: newFile.url, public_id: newFile.public_id };
    })
  );
  // console.log(images);
  const newPost = await Post.create({
    // r calling from schema * Create Post *
    title,
    content,
    images,
    author: req.user._id,
  });
  // console.log(newPost);
  res.redirect("/posts");
  // res.render("newPost", {
  //   title: "Create Post",
  //   user: req.user,
  //   success: "Post created Successfully",
  //   error: "",
  // });
});


//! Get All Posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    posts,
    user: req.user,
    success: "",
    error: "",
  });
});

//! Get a Post By Id
exports.getPostById = asyncHandler(async (req, res) => {
  // comment populate
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });
  res.render("postDetails", {
    title: "Post",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});

//! GetEdit Post Form
exports.getEditPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }
  res.render("editPost", {
    title: "Edit Post",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});

//! Update Post Logic while editing
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);
  // check if post exists
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }

  //! Check if the user is the author of the post
  if (post.author.toString() != req.user._id.toString()) {
    return res.render("postDetails.ejs", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "You do not have permission to edit this post",
    });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id); // delete image from cloudinary
      })
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        public_id: file.filename,
        url: file.path,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return {
        public_id: newFile.public_id,
        url: newFile.url,
      };
    })
  );
  await post.save();
  res.redirect(`/posts/${post._id}`);
  // which was given in the editPost.ejs
});


//! Delete Post
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id); 
  if (!post) {
    return res.render("postDetails.ejs", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Post not found"
    });
  }
  // check if user is the author of the post
  if (post.author.toString() !== req.user._id.toString()) { 
    return res.render("postDetails.ejs", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "You are not the author of this post"
    });
  }
// delete post from cloudinary
  await Promise.all(post.images.map(async (image) => {
    //cloudinary and uploader(multer)
    await cloudinary.uploader.destroy(image.public_id);
  }));
// delete post from database
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/posts');
};
  

