import HeadingOne from "../../components/HeadingOne";
import { useLocation, useNavigate } from "react-router";
import Button from "../../components/Button";

export default function FourOhFour() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname;
  return (
    <div className="flex flex-col items-center">
      <HeadingOne alignment="center">No Page "{pageName}"</HeadingOne>
      <p className="mb-8">Sorry, the page you requested was not found.</p>
      <Button
        variant="emphasized"
        className="mx-auto "
        onClick={() => navigate("/")}
      >
        Return Home
      </Button>
    </div>
  );
}
