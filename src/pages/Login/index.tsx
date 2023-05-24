import HeadingOne from "../../components/HeadingOne";
import { useState } from "react";
import { request } from "../../lib/fetchHelpers";

export default function Login() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleSubmit() {
    request("/login", {
      method: "post",
      body: JSON.stringify({
        user,
        password,
      }),
    })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err: Error) => {
        console.error(err.message);
      });
  }

  return (
    <div className="container mx-auto flex max-w-screen-sm justify-center">
      <div className="w-full rounded-xl border bg-white p-4">
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
