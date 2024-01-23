import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import { UserModel } from "../src/models/user.model.js";

export const LocalLogin = passport.use(
  new LocalStrategy(function (username, password, done) {
    UserModel.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

export const GoogleLogin = passport.use(
  new GoogleStrategy(
    {
      clientID:
        "805446160117-aocb2h4edepp2pt8seku6f2r4pgvt8r8.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:1000/user/auth/google/secrets",
    },
    async (accessToken, refreshToken, profile, done) => {

      const existingUser = await UserModel.findOne({
        email: profile._json.email,
      });
      if (!existingUser) {
        const newUser = await new UserModel({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: "Hidden",
          loggedInWith: "Google",
        });
        await newUser.save();
      }

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
