import { FormEvent, useState } from "react";
import HeadingOne from "../../components/HeadingOne";
import useAuthConsumer from "../../context/authContext";
import { AlertTriangle, Loader } from "react-feather";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, authLoading, authError } = useAuthConsumer();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username && password) {
      login(username, password);
    }
  }

  return (
    <div className="mx-auto flex max-w-screen-sm justify-center">
      <div className="w-full rounded-lg border bg-white p-4">
        <div className="flex justify-center">
          <HeadingOne alignment="center">Login</HeadingOne>
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
            />
          </label>
          <button
            className="!mt-8 w-full rounded border bg-active py-2 text-xl text-white disabled:bg-opacity-80"
            disabled={authLoading || !(Boolean(username) && Boolean(password))}
            type="submit"
          >
            {!authLoading && "Submit"}
            {authLoading && (
              <Loader
                aria-label="Login request loading"
                className="mx-auto animate-spin"
              />
            )}
          </button>
          {authError && (
            <p className="flex w-full animate-fadeIn items-center rounded border bg-red-100 p-4">
              <AlertTriangle className="mr-2 inline " />
              Could not authenticate with those credentials, please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
