import api from "./index.js";

const Tasks = {
  submit: (title, description, amount) =>
    api.post("tasks/submit", { title, description, amount }),
  fetchAll: () => api.get("tasks/fetchAll"),
  get: (taskId) => api.get("tasks/get", { params: { taskId } }),
  applications: (taskId) =>
    api.get("/tasks/applications", { params: { taskId } }),
  apply: (uuid, text) => api.post("tasks/apply", { uuid, text }),
  delete: (uuid) => api.post("tasks/delete", { uuid }),
};

export default Tasks;
