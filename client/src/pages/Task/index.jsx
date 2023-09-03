import {
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

import ApplicationSentModal from "./ApplicationSentModal";
import DisplayError from "components/DisplayError";
import { Formik } from "formik";
import Input from "components/Input";
import React from "react";
import Separator from "components/Separator";
import SubmitButton from "components/SubmitButton";
import TaskDeleteConfirmation from "./TaskDeleteModal";
import Tasks from "api/Tasks";
import formatBan from "utils/formatter";
import { useMainStore } from "stores";

export default () => {
  const navigate = useNavigate();
  const [applicationSentModalIsOpen, setApplicationSentModalIsOpen] =
    React.useState(false);
  const [alreadySent, setAlreadySent] = React.useState(false);

  const [taskDeleteConfirmationIsOpen, setTaskDeleteConfirmationIsOpen] =
    React.useState(false);

  const [error, setError] = React.useState("");

  const { user } = useMainStore();
  const [task, setTask] = React.useState();
  let params = useParams();

  const refreshPage = async () => {
    try {
      const taskId = params.taskId;
      const result = await Tasks.get(taskId).then((res) => res.data);

      const formattedTimeStamp = format(
        parseISO(result.timestamp),
        "dd-MM-yyyy HH:mm"
      ).toUpperCase();

      setTask({
        ...result,
        timestamp: formattedTimeStamp,
      });
    } catch (e) {
      navigate(`/`, { replace: true });
    }
  };

  React.useEffect(() => {
    refreshPage();
  }, []);

  if (!task) return <div>Loading task</div>;

  const deleteTask = async () => {
    try {
      if (!task) return;
      await Tasks.delete(task.uuid);
      navigate(`/my-tasks`, { replace: true });
    } catch (e) {
      navigate(`/my-tasks`, { replace: true });
    }
  };

  return (
    <div className="flex flex-col">
      {!task.verified && user.id === task.owner && (
        <div>
          <h1 className="font-bold text-2xl text-amber-400 flex gap-2">
            <ExclamationTriangleIcon className="w-8" />
            Only you can see this task.
          </h1>
          <p className="mt-4">
            You must verify this task by depositing the full bounty amount into
            the address below. <br />
            Once deposited the bounty will be held in escrow until you decide to
            release it to someone or cancel the task.
          </p>
          <p className="mt-8 border p-4 rounded">{task.banano_address}</p>
          <p className="flex gap-2 mt-1 text-sm">
            Bananos in escrow: {formatBan(task.balance)} | Required to verify
            task: {formatBan(task.amount + task.fee)}
          </p>
          <Separator />
        </div>
      )}

      {user.id === task.owner && (
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-2xl flex gap-2 mb-2">
            <AdjustmentsHorizontalIcon className="w-8" />
            Task Management
          </h1>
          <a
            href={`/tasks/${task.uuid}/applications`}
            className="border rounded py-2 px-4 text-center hover:text-amber-400 w-fit"
          >
            VIEW APPLICATIONS
          </a>
          <button
            className="border rounded py-2 px-4 text-center hover:text-red-400 w-fit"
            onClick={() => setTaskDeleteConfirmationIsOpen(true)}
          >
            DELETE TASK
          </button>

          <Separator />
        </div>
      )}

      <div className="flex flex-col text-sm">
        <h1 className="font-bold text-2xl">{task.title}</h1>
        <h1 className="font-bold text-gray-100 text-base mt-4">
          Posted by {task.username}
        </h1>
        <p className="mt-1 text-sm">{task.timestamp}</p>
        <h1 className="font-bold text-gray-100 text-base mt-2">Bounty</h1>
        <p className="mt-1 text-sm">{formatBan(task.amount)}</p>
        <h1 className="mt-8 font-bold text-lg">About this task</h1>
        <p className="mt-2 whitespace-pre-wrap">{task.description}</p>
        {user && (
          <React.Fragment>
            <Separator />
            <h1 className="mt-8 font-bold text-lg">Apply for this task</h1>
            <Formik
              initialValues={{ text: "", checkbox: false }}
              validate={(values) => {
                const errors = {};
                if (!values.text) {
                  errors.text = "This field is required.";
                }

                if (!values.checkbox) {
                  errors.checkbox = "This field is required.";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const result = await Tasks.apply(task.uuid, values.text);
                  if (result.data.alreadySent) setAlreadySent(true);

                  setApplicationSentModalIsOpen(true);
                } catch (e) {
                  setError(e.response?.data);
                }
                setSubmitting(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="w-full mt-4">
                  <div className="mb-4">
                    <p className="text-zinc-200 mb-2">Application</p>
                    <Input
                      value={values.text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="on"
                      placeholder="I can do this gig!"
                      name="text"
                    />
                    <p className="text-zinc-200 mt-2 text-xs">
                      * Tell the poster why you are a good fit for this gig and
                      would like to do it. <br />* Make sure to leave some kind
                      of contact information (e.g. Discord or Reddit) so they
                      can reach out. This website does not have a chat.
                    </p>
                    {errors.text && touched.text && (
                      <DisplayError error={errors.text} />
                    )}
                    <div className="mt-6 flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id="checkbox"
                        value={values.checkbox}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p className="text-zinc-200 text-center">
                        I made sure to leave contact information in my
                        application.
                      </p>
                    </div>
                    {errors.checkbox && touched.checkbox && (
                      <DisplayError error={errors.checkbox} />
                    )}
                  </div>
                  {error && (
                    <div className="my-2">
                      <DisplayError error={error} />
                    </div>
                  )}
                  <SubmitButton
                    fit
                    disabled={isSubmitting || !values.text || !values.checkbox}
                    text="Apply"
                  />
                </form>
              )}
            </Formik>
          </React.Fragment>
        )}
      </div>
      <ApplicationSentModal
        isOpen={applicationSentModalIsOpen}
        setIsOpen={setApplicationSentModalIsOpen}
        alreadySent={alreadySent}
      />
      <TaskDeleteConfirmation
        isOpen={taskDeleteConfirmationIsOpen}
        setIsOpen={setTaskDeleteConfirmationIsOpen}
        deleteTask={deleteTask}
      />
    </div>
  );
};
