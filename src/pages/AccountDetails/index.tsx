import Button from "../../components/Button";
import HeadingOne from "../../components/HeadingOne";
import useAuthConsumer from "../../context/authContext";

export default function AccountDetails() {
  const { userName, userType, logout } = useAuthConsumer();
  return (
    <main className="mx-auto max-w-screen-sm rounded border bg-white p-4">
      <div className="mx-auto w-fit">
        <HeadingOne alignment="center">Account Details</HeadingOne>
      </div>
      <h2 className="text-sm text-black text-opacity-70">User Name</h2>
      <p className="mb-4 text-lg font-semibold">{userName}</p>
      <h2 className="text-sm text-black text-opacity-70">Account Type</h2>
      <p className="mb-4 text-lg font-semibold">{userType}</p>
      <Button
        className="mt-4 w-full"
        size="lg"
        variant="emphasized"
        onClick={logout}
      >
        Log Out
      </Button>
    </main>
  );
}
