import Button from "../components/generic/Button";
import HeadingOne from "../components/generic/HeadingOne";
import SpinningLoader from "../components/generic/SpinningLoader";
import useAuthConsumer from "../context/authContext";

export default function AccountDetails() {
  const { authLoading, authUser, logout } = useAuthConsumer();
  if (!authUser) {
    return null;
  }
  return (
    <main className="mx-auto max-w-screen-sm rounded border bg-white p-4">
      <div className="mx-auto w-fit">
        <HeadingOne alignment="center">Account Details</HeadingOne>
      </div>
      <h2 className="text-sm text-black text-opacity-70">User Name</h2>
      <p className="mb-4 text-lg font-semibold">{authUser.username}</p>
      <Button
        className="mt-4 w-full"
        size="lg"
        variant="emphasized"
        onClick={logout}
        disabled={authLoading}
      >
        {!authLoading && "Log Out"}
        {authLoading && <SpinningLoader label="Login request loading" />}
      </Button>
    </main>
  );
}
