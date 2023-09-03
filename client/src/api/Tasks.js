import api from "./index.js";

const Tasks = {
  submit: (title, description, amount) =>
    api.post("tasks/submit", { title, description, amount }),
  fetchAll: () => api.get("tasks/fetchAll"),
  get: (taskId) => api.get("tasks/get", { params: { taskId } }),
  apply: (uuid, text) => api.post("tasks/apply", { uuid, text }),
};

export default Tasks;
