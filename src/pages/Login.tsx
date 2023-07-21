import { FormEvent, useState } from "react";
import HeadingOne from "../components/generic/HeadingOne";
import useAuthConsumer from "../context/authContext";
import { AlertTriangle } from "react-feather";
import SpinningLoader from "../components/generic/SpinningLoader";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const { login, authLoading, authError, isAdminRoute } = useAuthConsumer();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username && password) {
      login(username, password, remember);
    }
  }

  return (
    <div className="mx-auto flex max-w-screen-sm justify-center accent-active">
      <div className="w-full rounded-lg border bg-white p-4">
        <div className="flex justify-center">
          <HeadingOne alignment="center">
            {isAdminRoute ? "Admin" : "Patient"} Login
          </HeadingOne>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex w-full flex-col">
            <span className="after:content-['*']">Username</span>
            <input
              required
              placeholder="Enter Username"
              className="w-full rounded border bg-primary-100 p-2 placeholder:italic placeholder:text-black placeholder:opacity-70"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
            />
          </label>
          <label className="flex w-full flex-col">
            <span className="after:content-['*']">Password</span>
            <input
              required
              placeholder="Enter Password"
              className="w-full rounded border bg-primary-100 p-2 placeholder:italic placeholder:text-black placeholder:opacity-70"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label className="block">
            <input
              className="mr-2"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember Me
          </label>
          <button
            className="d bled:bg-opacity-80 h-12 w-full rounded border bg-active py-2 text-xl
            text-white"
            disabled={authLoading || !(Boolean(username) && Boolean(password))}
            type="submit"
          >
            {!authLoading && "Submit"}
            {authLoading && <SpinningLoader label="Login request loading" />}
          </button>
          {authError && (
            <p className="flex w-full animate-fade-in items-center rounded border bg-red-100 p-4">
              <AlertTriangle className="mr-2 inline " />
              {authError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
