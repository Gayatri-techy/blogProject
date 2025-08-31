//! USERNAME - gayathrimariyappan123
//! PASSWORD - oYL2TL9bWhJcBhZq
//! CONNECTION STRING - mongodb+srv://gayathrimariyappan123:oYL2TL9bWhJcBhZq@fullstack-blog.6903mky.mongodb.net/?retryWrites=true&w=majority&appName=FullStack-Blog
// mongodb+srv://gayathrimariyappan123:oYL2TL9bWhJcBhZq@fullstack-blog.6903mky.mongodb.net/fullstack-blog

// Import Modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

// Path modules
const User = require("./models/user");
const userRoutes = require("./routes/authRoutes");
const passportConfig = require("./config/passport");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentsRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
// PORT - declaring name in env
const port = process.env.PORT || 3000;

//* To pass the form data*
app.use(express.urlencoded({ extended: true }));

// middleware for session (for session cookies)
app.use(
  session({
    secret: "XSecretKeyX",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport Config
passportConfig(passport);
app.use(passport.initialize());

// store the session
app.use(passport.session());

// middleware for methodOverride - for http method put and delete
app.use(methodOverride("_method"));

// for ejs
app.set("view engine", "ejs");

// Route for home
app.get("/", (req, res) => {
  res.render("home", { title: "Home", user: req.user, error: "" });
});

// middleware for UserRoutes
app.use("/auth", userRoutes);

// middleware for PostRoutes
app.use("/posts", postRoutes);

// middleware for CommentRoutes
app.use("/", commentRoutes);

// middleware for UserProfileRoutes
app.use("/user", profileRoutes);

// ErrorHandler
app.use(errorHandler);

//* Connect the db include server start
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => console.log("Server is running on the port"));
    console.log("MongoDb Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

