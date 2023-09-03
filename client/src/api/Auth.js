import api from "./index.js";

const Auth = {
  login: (email, password) => api.post("auth/login", { email, password }),
  register: (email, username, password) =>
    api.post("auth/register", { email, username, password }),
  logout: () => api.get("auth/logout"),
};

export default Auth;
