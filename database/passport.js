const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./user');
const bcrypt = require('bcrypt');

// const user = require('./user');

// Configure the local strategy for use by Passport
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await userModel.findOne({ username: username }).exec();
      
      // If user not found, return incorrect username message
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // If password is incorrect, return incorrect password message
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      // If all is well, return the user
      return done(null, user);
    } catch (err) {
      // If there's an unknown error, return the error
      return done(err);
    }
  }
));

// Persist user data into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Fetch user details using session ID
passport.deserializeUser(async function(id, done) {
  try {
    const user = await userModel.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
