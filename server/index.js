import connectRedis from "connect-redis";
import cors from "cors";
import { createClient } from "redis";
import express from "express";
import session from "express-session";
import { setupApiRoutes } from "./routes/index.js";
import setupAuth from "./auth.js";

const RedisStore = connectRedis(session);

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

const start = async () => {
  try {
    const redisClient = createClient({ legacyMode: true });
    await redisClient.connect();
    await redisClient.ping();

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    const store = new RedisStore({ client: redisClient });

    const sessionMiddleware = session({
      secret: `L}7;fXH71K^ic<%2>pJLC&m7%V`,
      resave: false,
      saveUninitialized: false,
      store: store,
    });

    setupAuth(app, sessionMiddleware);
    setupApiRoutes(app);

    app.listen(8080);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();

process.on("uncaughtException", (err) => {
  console.log("error", err);
});
