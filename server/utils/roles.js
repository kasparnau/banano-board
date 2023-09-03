import { getPool } from "../api.js";

export const hasRole = (clientInfo, role) => {
  return clientInfo.user.roles.find((e) => e === role);
};

export const addRole = async (username, role) => {
  if (role === "admin") throw new Error("This role can't be added!");

  const client = await getPool();
  try {
    const userId = !isNaN(username)
      ? username
      : await client
          .query("SELECT id FROM users WHERE username = $1", [username])
          .then((res) => res.rows[0]?.userId);
    if (!userId) throw new Error("User not found!");

    const roles = await client
      .query("SELECT * FROM user_roles WHERE user_id = $1", [userId])
      .then((roles) => roles.rows.map((x) => x.role));

    if (roles.find((e) => e === role))
      throw new Error("User already has this role!");

    await client.query(
      "INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
      [userId, role]
    );

    return true;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
};

export const removeRole = async (username, role) => {
  if (role === "admin") throw new Error("This role is non removable!");

  const client = await getPool();
  try {
    const id = !isNaN(username)
      ? username
      : await client
          .query("SELECT id FROM users WHERE username = $1", [username])
          .then((res) => res.rows[0]?.id);
    if (!id) throw new Error("User not found!");

    const roles = await client
      .query("SELECT * FROM user_roles WHERE user_id = $1", [id])
      .then((roles) => roles.rows.map((x) => x.role));

    if (!roles.find((e) => e === role))
      throw new Error("User doesn't have this role!");

    await client.query(
      "DELETE FROM user_roles WHERE user_id = $1 AND role = $2",
      [id, role]
    );

    return true;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
};
