import express from "express";
import { floor } from "../utils/utils.js";
import { generateRandomWallet } from "../utils/banano.js";
import { getPool } from "../api.js";
import { loggedIn } from "./helpers.js";
import { v4 as uuidv4 } from "uuid";

const submit = async function (req, res) {
  const client = await getPool();
  try {
    const title = req.body.title;
    const description = req.body.description;

    // VALIDATION
    if (isNaN(req.body.amount))
      return res.status(400).send("Unexpected error.");

    const amount = floor(req.body.amount);

    if (amount < 10)
      return res.status(400).send("Minimum bounty is 10 bananos!");

    const { address, seed } = await generateRandomWallet();
    const uuid = uuidv4();

    const result = await client
      .query(
        "INSERT INTO tasks (owner, title, description, amount, banano_address, banano_seed, uuid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [req.user.id, title, description, amount, address, seed, uuid]
      )
      .then((res) => res.rows[0]);

    if (!result || !result.id) throw new Error("Error inserting row");

    return res.status(200).json({ taskId: uuid });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong!");
  } finally {
    client.release();
  }
};

const fetchAll = async (req, res) => {
  const client = await getPool();
  try {
    const tasks = await client
      .query(
        "SELECT T.uuid, T.title, T.amount, T.verified, U.username FROM tasks T INNER JOIN users U on (U.id = T.owner) ORDER BY T.id DESC"
      )
      .then((res) => res.rows);

    res.status(200).json({ tasks });
  } catch (e) {
    console.log(e);
    res.status(500).send("Failed to fetch");
  } finally {
    client.release();
  }
};

export const taskRoutes = express.Router();

taskRoutes.post("/submit", loggedIn, submit);
taskRoutes.get("/fetchAll", fetchAll);
