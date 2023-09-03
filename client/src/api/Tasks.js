import api from "./index.js";

const Tasks = {
  submit: (title, description, amount) =>
    api.post("tasks/submit", { title, description, amount }),
  fetchAll: () => api.get("tasks/fetchAll"),
};

export default Tasks;
