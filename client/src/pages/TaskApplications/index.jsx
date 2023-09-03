import {
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";

import DisplayError from "components/DisplayError";
import { Formik } from "formik";
import Input from "components/Input";
import Modal from "./Modal";
import React from "react";
import Separator from "components/Separator";
import SubmitButton from "components/SubmitButton";
import Tasks from "api/Tasks";
import formatBan from "utils/formatter";
import { useMainStore } from "stores";
import { useParams } from "react-router-dom";

export default () => {
  const { user } = useMainStore();
  const [task, setTask] = React.useState();
  const [applications, setApplications] = React.useState([]);
  let params = useParams();

  const refreshPage = async () => {
    try {
      const result = await Tasks.get(params.taskId).then((res) => res.data);

      const formattedTimeStamp = format(
        parseISO(result.timestamp),
        "dd-MM-yyyy HH:mm"
      ).toUpperCase();

      setTask({
        ...result,
        timestamp: formattedTimeStamp,
      });

      await Tasks.applications(result.id).then((res) =>
        setApplications(res.data)
      );
    } catch (e) {}
  };

  React.useEffect(() => {
    refreshPage();
  }, []);

  if (!task) return <div>Loading task</div>;

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl">Task Applications</h1>
      <p className="text-zinc-400">
        Applications for the selected task ({task.uuid}).
      </p>
      <Separator />
      <h1 className="">Task: {task.title}</h1>
      <div className="flex flex-col gap-4 mt-4">
        {applications.map((app) => {
          return (
            <div className="p-2 border rounded">
              {app.username}: {app.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
