import { getPool, getUser } from "./api.js";

import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const client = await getPool();

      const loginType = email.indexOf("@") > -1 ? "email" : "username";
      try {
        const user = await client
          .query(`SELECT * FROM users WHERE ${loginType} = $1`, [email])
          .then((res) => res.rows[0]);
        if (!user)
          return done(
            null,
            false,
            "The user or password you entered is incorrect."
          );

        const roles = await client
          .query("SELECT role FROM user_roles WHERE user_id = $1", [user.id])
          .then((res) => res.rows.map((x) => x.role));
        const isBanned = roles.find((role) => role === "ban");

        bcrypt.compare(password, user.password, (err, success) => {
          if (err) return done(err);
          if (success) {
            if (isBanned) return done(null, false, "This user is suspended.");
            return done(null, user);
          } else {
            return done(
              null,
              false,
              "The user or password you entered is incorrect."
            );
          }
        });
      } catch (e) {
        console.error(e);
        return done(null, false, "SQL error? Should never happen.");
      } finally {
        client.release();
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const client = await getPool();

  try {
    const user = await getUser(id);
    return done(null, user);
  } catch (e) {
    done(e);
  } finally {
    client.release();
  }
});

export const notAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return next();
  } else {
    res.status(401).send("You are already authenticated.");
  }
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() || !req.user) {
    return next();
  } else {
    res.status(401).send("You are not authenticated.");
  }
};

const setupAuth = (app, sessionMiddleware) => {
  app.set("trust proxy", true);

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
};

export default setupAuth;
