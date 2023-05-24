import { useState } from "react";
import HeadingOne from "../../components/HeadingOne";
import useAuthConsumer from "../../context/authContext";

export default function Login() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuthConsumer();

  function handleSubmit() {
    login(user, password).catch((err: Error) => {
      console.error(err.message);
    });
  }

  return (
    <div className="container mx-auto flex max-w-screen-sm justify-center">
      <div className="w-full rounded-lg border bg-white p-4">
        <div className="flex justify-center">
          <HeadingOne alignment="center">Login</HeadingOne>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex w-full flex-col">
            Username
            <input
              placeholder="Enter Username"
              className="w-full rounded border bg-primary-100 p-2 placeholder:italic placeholder:text-black placeholder:opacity-70"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </label>
          <label className="flex w-full flex-col">
            Password
            <input
              placeholder="Enter Password"
              className="w-full rounded border bg-primary-100 p-2 placeholder:italic placeholder:text-black placeholder:opacity-70"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="!mt-8 w-full rounded border bg-active py-2 text-xl text-white"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
