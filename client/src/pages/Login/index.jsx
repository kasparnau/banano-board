import { Navigate, redirect } from "react-router-dom";

import Auth from "api/Auth";
import DisplayError from "components/DisplayError";
import { Formik } from "formik";
import Input from "components/Input";
import React from "react";
import SubmitButton from "components/SubmitButton";
import { useMainStore } from "stores";

export default () => {
  const [error, setError] = React.useState("");
  const { user } = useMainStore();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <div className="flex flex-col w-full max-w-sm justify-center items-center">
        <h1 className="font-semibold text-2xl">Login to Banano Board</h1>
        <p className="text-zinc-400 text-sm mt-2 mb-8">
          Enter your details below to sign in to your account
        </p>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center z-[1]">
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "This field is required.";
                }

                if (!values.password) {
                  errors.password = "This field is required.";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await Auth.login(values.email, values.password);
                  // refresh page hacky method
                  window.location = window.location.href.split("?")[0];
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
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-6"
                >
                  <div className="">
                    <Input
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      title={"Username or Email"}
                      autoComplete="email"
                      placeholder="Username or Email"
                      type="username"
                      name="email"
                      id="email"
                      required
                    />
                    {errors.email && touched.email && (
                      <DisplayError error={errors.email} />
                    )}
                  </div>
                  <div className="">
                    <Input
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      title={"Password"}
                      placeholder="Password"
                      hide={true}
                      autoComplete="current-password"
                      name="password"
                      type="password"
                      id="password"
                      required
                    />
                    {errors.password && touched.password && (
                      <DisplayError error={errors.password} />
                    )}
                  </div>
                  <button
                    type="button"
                    className="w-full flex justify-end items-center font-semibold text-sm text-gray-300"
                    onClick={() => {}}
                  >
                    Forgot your password?
                  </button>
                  {error && (
                    <div className="">
                      <DisplayError error={error} />
                    </div>
                  )}

                  <SubmitButton disabled={isSubmitting} text="Sign In" />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-black px-2 text-zinc-400">
                        OR CREATE AN ACCOUNT
                      </span>
                    </div>
                  </div>

                  <a
                    className={`w-full h-[37px] rounded-md text-sm transition-colors bg-black border hover:bg-zinc-800
                    flex justify-center items-center`}
                    href="/register"
                  >
                    I don't have an account yet
                  </a>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
