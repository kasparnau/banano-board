import { Link, Navigate, redirect } from "react-router-dom";

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
        <h1 className="font-semibold text-2xl">Create an account</h1>
        <p className="text-zinc-400 text-sm mt-2 mb-8">
          Enter your details below to create your account
        </p>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col justify-center items-center z-[1]">
            <Formik
              initialValues={{
                email: "",
                password: "",
                username: "",
                address: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "This field is required.";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address.";
                }

                if (!values.address) {
                  errors.address = "This field is required.";
                } else if (
                  !/^ban_[13][0-13-9a-km-uw-z]{59}$/i.test(values.address)
                ) {
                  errors.address = "Invalid banano address.";
                }

                if (!values.username) {
                  errors.username = "This field is required";
                } else if (
                  values.username.length < 3 ||
                  values.username.length > 20
                ) {
                  errors.username =
                    "Username should be between 3 and 20 characters long.";
                } else if (!/^[a-z0-9]+$/i.test(values.username)) {
                  errors.username =
                    "Username can not contain any special characters.";
                }

                var hasNumber = /[0-9]+/;
                var hasUpperChar = /[A-Z]+/;
                var hasMiniMaxChars = /.{8,50}/;
                var hasLowerChar = /[a-z]+/;

                if (!values.password) {
                  errors.password = "This field is required.";
                } else if (!hasLowerChar.test(values.password)) {
                  errors.password =
                    "Password should contain at least one lower case letter.";
                } else if (!hasUpperChar.test(values.password)) {
                  errors.password =
                    "Password should contain at least one upper case letter.";
                } else if (!hasNumber.test(values.password)) {
                  errors.password =
                    "Password should contain at least one number.";
                } else if (!hasMiniMaxChars.test(values.password)) {
                  errors.password =
                    "Password should contain at least 8 characters.";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await Auth.register(
                    values.email,
                    values.username,
                    values.password,
                    values.address
                  );
                  window.location.reload();
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
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      title={"Username"}
                      placeholder="Username"
                      autoComplete="off"
                      type="username"
                      name="username"
                      id="username"
                      required
                    />
                    {errors.username && touched.username && (
                      <DisplayError error={errors.username} />
                    )}
                  </div>
                  <div className="">
                    <Input
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="email"
                      placeholder="Email Address"
                      type="email"
                      title="Email Address"
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
                      required
                    />
                    {errors.password && touched.password && (
                      <DisplayError error={errors.password} />
                    )}
                  </div>

                  <div>
                    <Input
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      title={"Your Banano Address"}
                      autoComplete="on"
                      placeholder="ban_"
                      name="address"
                      required
                    />
                    {errors.address && touched.address && (
                      <DisplayError error={errors.address} />
                    )}
                  </div>

                  {error && (
                    <div className="">
                      <DisplayError error={error} />
                    </div>
                  )}
                  <SubmitButton disabled={isSubmitting} text="Register" />
                  <p className="px-8 text-center text-sm text-zinc-400">
                    By registering, you agree to our
                    <br />
                    <a
                      href="/terms"
                      className="underline underline-offset-4 hover:text-zinc-50"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-zinc-50"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-black px-2 text-zinc-400">
                        OR LOG IN
                      </span>
                    </div>
                  </div>

                  <a
                    className={`w-full h-[37px] rounded-md text-sm transition-colors bg-black text-white border hover:bg-zinc-800
                    flex justify-center items-center`}
                    href="/login"
                  >
                    I already have an account
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
