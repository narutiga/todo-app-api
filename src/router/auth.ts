import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStorategy } from "passport-google-oauth20";
import prisma from "../lib/prisma/client";
import * as redis from "redis";

// import connectRedis from "connect-redis";
// const RedisStore = connectRedis(session);

// const url = (process.env.REDIS_URL as string) ?? "redis://localhost:6379";

// const client = redis.createClient({ url });

// Strategyの設定
passport.use(
  new GoogleStorategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      const id = profile.id;
      const user = prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        prisma.user.create({
          data: {
            id,
            name: profile.displayName,
            icon_image: "",
          },
        });
        return done(null, user);
      }
      return done(null, user);
    }
  )
);

// sessionに保存
passport.serializeUser((user, done) => {
  console.log("シリアライズ！");
  done(null, user);
});
// sessionから復元
passport.deserializeUser((user, done) => {
  console.log("デシリアライズ！");
  done(null, user as Express.User);
});

const router = express.Router();

// middlewareの設定
router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // store: new RedisStore({ client }),
  })
);
router.use(passport.initialize());
router.use(passport.session());

// ルーティング
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile"],
    accessType: "offline",
  })
);

router.route("/google/redirect").get(
  passport.authenticate("google", {
    failureRedirect: "/google",
  }),
  (req, res) => {
    // console.log(req.user);
    // console.log(req.session);
    res.redirect("http://localhost:3000");
  }
);

router.get("/google/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.redirect("http://localhost:3000/");
  });
});

module.exports = router;
