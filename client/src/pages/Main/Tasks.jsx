import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import Tasks from "api/Tasks";
import formatBan from "utils/formatter";

const NewCard = () => {
  return (
    <a
      href="/new-task"
      className="h-40 w-40 border rounded flex justify-center items-center text-amber-600 hover:text-amber-400 transition-colors"
    >
      <PlusIcon className="w-16" />
    </a>
  );
};

export default () => {
  const [tasks, setTasks] = React.useState([]);

  const refreshTasks = async () => {
    const tasks = await Tasks.fetchAll().then((res) => res.data.tasks);
    setTasks(tasks);
  };

  React.useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className="flex gap-6 flex-wrap">
      <NewCard />
      {tasks.map((task) => {
        return (
          <a
            href={`/tasks/${task.uuid}`}
            className="h-40 md:w-1/4 w-full border rounded flex flex-col justify-between p-4 group"
            key={task.uuid}
          >
            <div className="group-hover:text-amber-400">{task.title}</div>
            <div className="justify-between flex w-full">
              <div className="flex flex-col">
                <p className="text-sm text-zinc-300 ">REQUESTER</p>
                <p>@{task.username}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-zinc-300 ">BOUNTY</p>

                <div>{formatBan(task.amount)}</div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};
