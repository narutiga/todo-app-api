import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const extractProfile = (profile: any) => {
  let imageUrl = "";
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl,
  };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = extractProfile(profile);
      process.nextTick(() => {
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

const router = express.Router();
// const router = Router();

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.route("/google/redirect").get(
  passport.authenticate("google", {
    failureRedirect: "/google",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

router.post("/google/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("http://localhost:3000");
});

export { passport };

export default router;
