const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

// render (or) display login
exports.pageLogin = asyncHandler((req, res) => {
  // res.json({ message: 'Login' });
  // console.log(req.user);
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
});

// Display Login Logic
// exports.loginLogic = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     const isPassword = await User.findOne({ password });
//     if (user && isPassword) {
//       res.send("Login Successfully");
//     } else {
//       res.send("Invalid Credentials");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// Login Logic
exports.loginLogic = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    console.log({ error, user, info });
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect("/");
      // return res.redirect('/user/profile');
    });
  })(req, res, next);
});

exports.register = asyncHandler((req, res) => {
  res.render("register", { title: "Register", user: req.user, error: null });
});

//! Testing - Register Logic
// exports.registerLogic = async (req, res) => {
//     //* testing by .send or .json
//     // res.send('Register Page');
//     // console.log(req.body);

//     const { username, email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             req.send('User already exists!');
//         }
//         else {
//             const newUser = new User({
//                 username, email, password
//             });
//             await newUser.save();
//         }
//         res.redirect('/auth/login');
//     }
//     catch (err) {
//         console.log(err);
//     }
// };

// Register Logic

exports.registerLogic = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashPassword });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
});

//logout
exports.logout = asyncHandler((req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/auth/login");
  });
});
