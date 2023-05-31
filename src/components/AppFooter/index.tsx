import { AlertCircle, GitHub } from "react-feather";
import packageJson from "../../../package.json";

function AnchorTag({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="cursor-pointer ">
      {children}
    </a>
  );
}

export default function AppFooter() {
  return (
    <footer className="flex flex-wrap ">
      <div className="sm:basis-1/2 flex basis-full flex-col space-y-2">
        <AnchorTag href="https://github.com/smart-on-fhir/ehi-app">
          <GitHub size="18" className="mr-2 inline" />
          Web Application Code
        </AnchorTag>
        <AnchorTag href="https://github.com/smart-on-fhir/ehi-app/issues/new/choose">
          <AlertCircle size="18" className="mr-2 inline" />
          Log a Frontend Issue
        </AnchorTag>
        <AnchorTag href="https://github.com/smart-on-fhir/ehi-server">
          <GitHub size="18" className="mr-2 inline" />
          Backend Server Code
        </AnchorTag>
        <AnchorTag href="https://github.com/smart-on-fhir/ehi-server/issues/new/choose">
          <AlertCircle size="18" className="mr-2 inline" />
          Log a Backend Issue
        </AnchorTag>
      </div>
      <div className="sm:basis-1/2 mt-2 flex basis-full flex-col space-y-2 sm:mt-0 sm:text-end">
        <p>
          © Copyright {new Date().getFullYear()} by the Computational Health
          Informatics Program, Boston Children's Hospital, Boston, MA.
        </p>
        <p>Version number {packageJson.version}</p>
      </div>
    </footer>
  );
}
