import {
  generateRandomWallet,
  getAmountFromRaw,
  processPending,
} from "../utils/banano.js";

import bananojs from "@bananocoin/bananojs";
import express from "express";
import { floor } from "../utils/utils.js";
import { getPool } from "../api.js";
import { loggedIn } from "./helpers.js";
import { v4 as uuidv4 } from "uuid";

// 19 BAN + 1% of bounty fee to verify task
const SUBMIT_FEE = 19;
const TAX_PERCENTAGE = 1;

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

    const FEE_TAX = (amount * TAX_PERCENTAGE) / 100;
    const fee = FEE_TAX + SUBMIT_FEE;

    const result = await client
      .query(
        "INSERT INTO tasks (owner, title, description, amount, banano_address, banano_seed, uuid, fee) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
        [req.user.id, title, description, amount, address, seed, uuid, fee]
      )
      .then((res) => res.rows[0]);

    if (!result || !result.id) throw new Error("Error inserting row");

    return res.status(200).json({ taskId: uuid });
  } catch (e) {
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
    res.status(500).send("Failed to fetch");
  } finally {
    client.release();
  }
};

const fetch = async (req, res) => {
  const client = await getPool();
  try {
    const taskId = req.query.taskId;

    if (!taskId) return res.status(404).send();

    let task = await client
      .query(
        "SELECT T.uuid, T.title, T.amount, T.verified, U.username, T.owner, T.description, T.banano_address, T.timestamp, T.fee FROM tasks T INNER JOIN users U on (U.id = T.owner) WHERE uuid = $1",
        [taskId]
      )
      .then((res) => res.rows[0]);

    if (!task.verified && req.user.id === task.owner) {
      // keep it in another query to avoid leaking it by mistake
      const banano_seed = await client
        .query("SELECT banano_seed FROM tasks WHERE uuid = $1", [task.uuid])
        .then((res) => res.rows[0]?.banano_seed);
      const processed = await processPending(banano_seed);

      if (processed) {
        const balanceRaw = await bananojs.getAccountBalanceRaw(
          task.banano_address
        );

        task.balance = parseFloat(getAmountFromRaw(balanceRaw));

        if (task.balance >= task.amount + task.fee) {
          await client.query(
            "UPDATE tasks SET verified = true WHERE uuid = $1",
            [task.uuid]
          );
          task.verified = true;
        }
      } else {
        res.status(500).send("Something went wrong...");
      }
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(500).send("Failed to fetch");
  } finally {
    client.release();
  }
};

const apply = async (req, res) => {
  const client = await getPool();
  try {
    const uuid = req.body.uuid;
    const text = req.body.text;
    if (!uuid || !text) return res.status(400).send();

    let task = await client
      .query("SELECT * FROM tasks WHERE uuid = $1", [uuid])
      .then((res) => res.rows[0]);
    if (!task) return res.status(400).send();

    let sentApplication = await client
      .query(
        "SELECT * FROM task_applications WHERE task_id = $1 AND owner = $2",
        [task.id, req.user.id]
      )
      .then((res) => res.rows[0]);
    if (sentApplication) return res.status(200).json({ alreadySent: true });

    await client.query(
      "INSERT INTO task_applications (owner, text, task_id) VALUES ($1, $2, $3)",
      [req.user.id, text, task.id]
    );

    res.status(200).send();
  } catch (e) {
    res.status(500).send("Failed to send application");
  } finally {
    client.release();
  }
};

export const taskRoutes = express.Router();

taskRoutes.post("/submit", loggedIn, submit);
taskRoutes.post("/apply", apply);
taskRoutes.get("/fetchAll", fetchAll);
taskRoutes.get("/get", fetch);
