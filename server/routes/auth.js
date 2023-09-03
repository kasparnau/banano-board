import { isAuthenticated, notAuthenticated } from "../auth.js";

import BadWordsFilter from "bad-words";
import bcrypt from "bcrypt";
import express from "express";
import geoip from "geoip-lite";
import { getPool } from "../api.js";
import passport from "passport";

export const authRoutes = express.Router();

const badWordFilter = new BadWordsFilter();

const isValidRegisterForm = (username, email, password, address) => {
  if (!email) {
    return false;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return false;
  }

  if (!username) {
    return false;
  } else if (username.length < 3 || username.length > 20) {
    return false;
  } else if (!/^[a-z0-9]+$/i.test(username)) {
    return false;
  }

  var hasNumber = /[0-9]+/;
  var hasUpperChar = /[A-Z]+/;
  var hasMiniMaxChars = /.{8,50}/;
  var hasLowerChar = /[a-z]+/;

  if (!password) {
    return false;
  } else if (!hasLowerChar.test(password)) {
    return false;
  } else if (!hasUpperChar.test(password)) {
    return false;
  } else if (!hasNumber.test(password)) {
    return false;
  } else if (!hasMiniMaxChars.test(password)) {
    return false;
  }

  if (!address) {
    return false;
  } else if (!/^ban_[13][0-13-9a-km-uw-z]{59}$/i.test(address)) {
    return false;
  }

  return true;
};

const login = async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (info) {
      res.status(400).send(info);
    } else {
      req.login(user, (err) => {
        if (!err) {
          res.status(200).send();
        } else {
          res.status(500).send("Unexpected error");
        }
      });
    }
  })(req, res, next);
};

const register = async function (req, res, next) {
  const client = await getPool();

  const username = req.body.username;
  const password = req.body.password;
  const address = req.body.address;
  const email = req.body.email;
  const ip = geoip.pretty(req.ip);

  try {
    if (!isValidRegisterForm(username, email, password, address)) {
      return res.status(400).send("Invalid form values?");
    }

    if (badWordFilter.isProfane(username))
      return res.status(400).send("Profanity in username forbidden.");

    const existingUser = await client
      .query(
        "SELECT email, username FROM users WHERE email = $1 OR username = $2",
        [email, username]
      )
      .then((res) => res.rows[0]);

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).send("This username is already taken!");
      } else if (existingUser.email === email) {
        return res
          .status(400)
          .send("An account with this email already exists!");
      }
      return;
    }

    // MAKE ACCOUNT NOW

    const passwordHash = await bcrypt.hash(password, 10);
    const geo = geoip.lookup(ip);

    const newUser = await client
      .query(
        "INSERT INTO users (email, username, password, registered_ip, registered_country, banano_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [email, username, passwordHash, ip, geo?.country || "UNKNOWN", address]
      )
      .then((res) => res.rows[0]);

    if (!newUser)
      return res.json({
        message: "Had an unexpected error creating account?",
      });

    req.login(newUser, (err) => {
      if (!err) {
        res.status(200).send();
      } else {
        res
          .status(500)
          .send(
            "Unexpected error signing in. Please Sign In manually into your newly registered account."
          );
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Encountered an unexpected error. Please try again later.",
    });
  } finally {
    client.release();
  }
};

const logout = function (req, res) {
  req.logout(function (err) {
    res.status(200).send();
  });
};

authRoutes.post("/login", notAuthenticated, login);
authRoutes.post("/register", notAuthenticated, register);
authRoutes.get("/logout", isAuthenticated, logout);
