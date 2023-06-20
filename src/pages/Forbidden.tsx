import HeadingOne from "../components/generic/HeadingOne";
import { useLocation, useNavigate } from "react-router";
import Button from "../components/generic/Button";

export default function Forbidden() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.state?.from;
  return (
    <div className="flex flex-col items-center">
      <HeadingOne alignment="center">
        {pageName && `"${pageName}" `}Access is Forbidden
      </HeadingOne>
      <p className="mb-8">
        Sorry, you don't have permission to view that page.
      </p>
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
