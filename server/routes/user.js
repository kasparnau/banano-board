import express from "express";
import { getPool } from "../api.js";
import { loggedIn } from "./helpers.js";

const updateAddress = async (req, res) => {
  const address = req.body.address;

  if (!address || !/^ban_[13][0-13-9a-km-uw-z]{59}$/i.test(address))
    return res.status(401).send("Invalid request");

  const client = await getPool();

  try {
    await client.query("UPDATE users SET banano_address = $1 WHERE id = $2", [
      address,
      req.user.id,
    ]);
    return res.status(200).send();
  } catch (e) {
    res.status(500).send("Invalid");
  } finally {
    client.release();
  }
};

const user = async function (req, res) {
  if (req.user) {
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      email_verified: req.user.email_verified,
      banano_address: req.user.banano_address,
      registered_timestamp: req.user.registered_timestamp,
    };
    res.status(200).json(user);
  } else {
    res.status(200).send(null);
  }
};

export const userRoutes = express.Router();

userRoutes.get("/", user);
userRoutes.post("/updateAddress", loggedIn, updateAddress);
