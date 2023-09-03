import { Navigate } from "react-router-dom";
import React from "react";
import Separator from "components/Separator";
import Tasks from "api/Tasks";
import { useMainStore } from "stores";

export default () => {
  const { user } = useMainStore();

  const [tasks, setTasks] = React.useState([]);

  const refreshTasks = async () => {
    const tasks = await Tasks.fetchAll().then((res) => res.data.tasks);
    console.log(tasks);
    setTasks(tasks.filter((task) => task.owner === user.id));
  };

  React.useEffect(() => {
    refreshTasks();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl">My Tasks</h1>
      <p className="text-zinc-400">Manage your tasks.</p>
      <Separator />
      <div className="flex flex-col text-sm gap-6">
        {tasks.map((task) => (
          <a className="border p-4 rounded" href={`/tasks/${task.uuid}`}>
            {task.title}
          </a>
        ))}
      </div>
    </div>
  );
};
