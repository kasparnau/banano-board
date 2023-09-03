import api from "./index.js";
import { useMainStore } from "stores/index.js";

const User = {
  get: () => api.get("user"),
  refresh: () => {
    api.get("user").then((x) => useMainStore.getState().setUser(x.data));
  },
  updateAddress: (address) => api.post("user/updateAddress", { address }),
};

export default User;
