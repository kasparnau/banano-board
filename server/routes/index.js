import { authRoutes } from "./auth.js";
import { taskRoutes } from "./tasks.js";
import { userRoutes } from "./user.js";

export const setupApiRoutes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/auth", authRoutes);
};
