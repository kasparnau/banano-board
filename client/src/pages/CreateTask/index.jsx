import Input, { RedAsterisk } from "components/Input";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import { Banano } from "utils/formatter";
import DisplayError from "components/DisplayError";
import { Formik } from "formik";
import React from "react";
import Separator from "components/Separator";
import SubmitButton from "components/SubmitButton";
import Tasks from "api/Tasks";
import User from "api/User";
import formatBan from "utils/formatter";
import { useMainStore } from "stores";

// This is not fetched from the server, and thus must be kept in sync manually by editing routes/tasks.js
const SUBMIT_FEE = 19;
const TAX_PERCENTAGE = 1;

export default () => {
  const { user } = useMainStore();

  const [error, setError] = React.useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl">Create Task</h1>
      <p className="text-zinc-400">
        Tasks let you request something to be done in exchange for bananos.
        <br />
        Example: "Set up a Minecraft server for me for 5K bananos"
      </p>
      <Separator />

      <div className="">
        <Formik
          initialValues={{ title: "", amount: "169", description: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = "This field is required.";
            } else if (values.title.length < 10 || values.title.length > 100) {
              errors.title =
                "Title must be between 10 and 100 characters long.";
            }

            if (!values.description) {
              errors.description = "This field is required.";
            } else if (
              values.description.length < 20 ||
              values.description.length > 2000
            ) {
              errors.description =
                "Description must be between 20 and 2000 characters long.";
            }

            if (!values.amount) {
              errors.amount = "This field is required.";
            } else if (isNaN(Number(values.amount))) {
              errors.amount = "Please enter a valid number.";
            } else if (parseFloat(values.amount) < 10) {
              errors.amount = "Minimum bounty amount is 10 bananos.";
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await Tasks.submit(
                values.title,
                values.description,
                values.amount
              );

              navigate(`/tasks/${result.data.taskId}`, { replace: true });
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
          }) => {
            let TOTAL_FEE;

            if (values.amount) {
              const FEE_TAX = (values.amount * TAX_PERCENTAGE) / 100;
              TOTAL_FEE = FEE_TAX + SUBMIT_FEE;
            }

            return (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <Input
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title={"Job Title"}
                    autoComplete="off"
                    placeholder="Do something for me..."
                    id="title"
                    required
                  />
                  {errors.title && touched.title && (
                    <DisplayError error={errors.title} />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <p className="text-sm text-gray-300">Job Description</p>
                    <RedAsterisk />
                  </div>
                  <textarea
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title={"Job Description"}
                    autoComplete="off"
                    placeholder="In-depth info about the job, expectations and skills required..."
                    id="description"
                    className="bg-black border p-2 rounded appearance-none outline-none text-sm placeholder:text-gray-500"
                  />
                  {errors.description && touched.description && (
                    <DisplayError error={errors.description} />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    title={"Bounty"}
                    placeholder="0.00"
                    autoComplete="off"
                    name="amount"
                    type="number"
                    prefix={<Banano />}
                    required
                  />
                  <p className="italic text-xs">
                    * THIS WEBSITE IS CURRENTLY IN DEMO MODE, ENTER ANY AMOUNT
                    FOR TESTING PURPOSES
                  </p>
                  {errors.amount && touched.amount && (
                    <DisplayError error={errors.amount} />
                  )}
                </div>

                {values.amount && !isNaN(values.amount) && (
                  <div className="text-sm flex flex-col gap-1">
                    <Separator />
                    <p className="font-semibold text-xl">COST BREAKDOWN</p>
                    <div className="flex gap-2 mt-2">
                      BOUNTY: {formatBan(parseFloat(values.amount).toFixed(2))}
                    </div>
                    <p className="text-xs text-zinc-400">
                      * This is the full bounty received by whoever completes
                      the job.
                    </p>
                    <div className="flex gap-2 mt-2">
                      SUBMIT FEE: {formatBan(parseFloat(TOTAL_FEE).toFixed(2))}
                    </div>
                    <p className="text-xs text-zinc-400">
                      * Fee used for the upkeep of Banano Board and to avoid
                      spam. Algorithm: 16.9 BAN + {TAX_PERCENTAGE}% of bounty
                    </p>
                    <div className="flex gap-2 mt-8">
                      TOTAL:{" "}
                      {formatBan(
                        parseFloat(values.amount) + parseFloat(TOTAL_FEE)
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      * Amount of bananos you will pay. If you don't find the
                      right applicant or change your mind, you may cancel the
                      task later for a refund. Submit fee is non-refundable.
                    </p>
                    <Separator />
                  </div>
                )}

                {error && (
                  <div className="">
                    <DisplayError error={error} />
                  </div>
                )}

                <SubmitButton disabled={isSubmitting} text="Submit Task" />
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
