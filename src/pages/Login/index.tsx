import { FormEvent, useState } from "react";
import HeadingOne from "../../components/HeadingOne";
import useAuthConsumer from "../../context/authContext";
import { AlertTriangle } from "react-feather";

export default function Login() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const { login } = useAuthConsumer();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError(null);
    if (user && password) {
      login(user, password).catch((err: Error) => {
        setAuthError(err.message);
        console.error(err.message);
      });
    }
  }

  return (
    <div className="container mx-auto flex max-w-screen-sm justify-center">
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
              value={user}
              onChange={(e) => setUser(e.target.value)}
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
            disabled={!(Boolean(user) && Boolean(password))}
            type="submit"
          >
            Submit
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
