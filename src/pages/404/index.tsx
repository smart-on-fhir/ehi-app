import { AlertOctagon } from "react-feather";
import HeadingOne from "../../components/HeadingOne";
import { useLocation, useNavigate } from "react-router";
import Button from "../../components/Button";

export default function FourOhFour() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname;
  return (
    <div>
      <HeadingOne>
        <AlertOctagon className="mr-2 inline" />
        No Page "{pageName}"
      </HeadingOne>
      <p>Nothing found... Return to the homepage?</p>
      <Button
        variant="emphasized"
        className="mx-auto flex h-12 w-44  items-center justify-center text-xl"
        onClick={() => navigate("/")}
      >
        Home Page
      </Button>
    </div>
  );
}
