import config from "./config.js";
import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool(config.db);

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

export const getPool = async () => {
  return await pool.connect();
};
