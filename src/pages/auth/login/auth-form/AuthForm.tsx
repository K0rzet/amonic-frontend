import React from "react";
import clsx from "clsx";

import styles from "./AuthForm.module.scss";

import { useAuthForm } from "./useAuthForm";

interface AuthFormProps {
  isLogin: boolean;
}

export function AuthForm({ isLogin }: AuthFormProps) {
  const { 
    handleSubmit, 
    isLoading, 
    onSubmit, 
    register, 
    failedAttempts, 
    isLocked, 
    lockoutTimeRemaining 
  } = useAuthForm(isLogin);

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-100 mx-auto">
        <div className="mb-4">
          <label className="">
            Email
            <input
              type="email"
              placeholder="Enter email: "
              {...register("email", { required: true })}
              className={clsx(
                styles["input-field"],
                "p-2 border rounded focus:outline-none focus:border-blue-500"
              )}
              disabled={isLocked}
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="">
            Password
            <input
              type="password"
              placeholder="Enter password: "
              {...register("password", { required: true })}
              className={clsx(
                styles["input-field"],
                "w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              )}
              disabled={isLocked}
            />
          </label>
        </div>

        {isLocked && (
          <div className="mb-3 text-red-500">
            Too many failed attempts. Please wait {lockoutTimeRemaining} seconds before trying again.
          </div>
        )}

        <div className="mb-3">
          <button
            type="submit"
            className={clsx(
              styles["btn-primary"],
              isLogin ? "bg-blue-500" : "bg-teal-500",
              (isLoading || isLocked) ? "opacity-75 cursor-not-allowed" : ""
            )}
            disabled={isLoading || isLocked}
          >
            {isLoading
              ? "Loading..."
              : isLogin
                ? "LOGIN"
                : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
