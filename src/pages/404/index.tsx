import { AlertOctagon } from "react-feather";
import HeadingOne from "../../components/HeadingOne";
import { useLocation, useNavigate } from "react-router";
import Button from "../../components/Button";

export default function FourOhFour() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname;
  return (
    <div className="flex flex-col items-center">
      <HeadingOne>
        <AlertOctagon className="mr-2 inline" />
        No Page "{pageName}"
      </HeadingOne>
      <p className="mb-4">Sorry, the page you requested was not found.</p>
      <Button
        variant="emphasized"
        className="mx-auto flex h-12 w-44  items-center justify-center text-xl"
        onClick={() => navigate("/")}
      >
        Return Home
      </Button>
    </div>
  );
}
