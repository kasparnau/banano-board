import { format, parseISO } from "date-fns";

import { Banano } from "utils/formatter";
import DisplayError from "components/DisplayError";
import { Formik } from "formik";
import Input from "components/Input";
import { Navigate } from "react-router-dom";
import React from "react";
import Separator from "components/Separator";
import SubmitButton from "components/SubmitButton";
import User from "api/User";
import { useMainStore } from "stores";

export default () => {
  const { user } = useMainStore();

  const [error, setError] = React.useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-2xl">Settings</h1>
      <p className="text-zinc-400">Manage your account settings.</p>
      <Separator />
      <div className="flex flex-col text-sm gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold">Username</h1>
          <h2 className="p-2 border text-zinc-400 rounded">{user.username}</h2>
          <h2 className="text-zinc-400 text-xs">
            This is your public display username.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-bold">Email</h1>
          <h2 className="p-2 border text-zinc-400 rounded">{user.email}</h2>
          <h2 className="text-zinc-400 text-xs">
            This is your account's email address.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-6">
            <h1 className="font-bold">Banano Address</h1>
            {!user?.banano_address && (
              <div className="flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#f87171"
                >
                  <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                </svg>
                <div className="ml-1 text-red-400 font-semibold">
                  No banano address associated with account
                </div>
              </div>
            )}
          </div>

          <h2 className="text-zinc-400 rounded">
            {user?.banano_address ? (
              <p className="p-2 border overflow-x-auto">
                {user.banano_address}
              </p>
            ) : (
              <Formik
                initialValues={{ address: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.address) {
                    errors.address = "This field is required.";
                  } else if (
                    !/^ban_[13][0-13-9a-km-uw-z]{59}$/i.test(values.address)
                  ) {
                    errors.address = "Please enter a valid banano address.";
                  }

                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await User.updateAddress(values.address);
                    User.refresh();
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
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                      <Input
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="on"
                        placeholder="ban_"
                        name="address"
                      />
                      {errors.address && touched.address && (
                        <DisplayError error={errors.address} />
                      )}
                    </div>
                    {error && (
                      <div className="my-2">
                        <DisplayError error={error} />
                      </div>
                    )}
                    <SubmitButton
                      fit
                      disabled={isSubmitting || !values.address}
                      text="Update banano address"
                    />
                  </form>
                )}
              </Formik>
            )}
          </h2>
          <h2 className="text-zinc-400 text-xs">
            This is your personal banano address. It is used to accept banano
            payment for completing tasks or selling services.
          </h2>
        </div>
      </div>
    </div>
  );
};
