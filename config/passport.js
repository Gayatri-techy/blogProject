const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      // done (callback fn inbuilt passport)
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "Username with the EmailId not found",
            });
          }
          // Compare the password (db(hashed password) and userInput)
          const isPassword = await bcrypt.compare(password, user.password);
          if (!isPassword) {
            return done(null, false, { message: "Invalid Password" });
          }
          // Auth success return user
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  //! Serialize - which should store the userdata with the SessionId
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // Deserialize the user based on the user based on the user stored in the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
