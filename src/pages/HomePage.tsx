import HeadingOne from "../components/generic/HeadingOne";
import LinkButton from "../components/generic/LinkButton";
import { isAdminRoute } from "../lib";

export default function Home() {
  return (
    <main className="space-y-8">
      <section id="app-demo" className="space-y-4">
        <HeadingOne>EHI Export Demo</HeadingOne>
        <p>
          The EHI Export API is a standards-based API designed for users to
          export their electronic health information (EHI) from hospital
          systems. We've created this web application to enable experimentation
          with the browser-based end of the EHI Export API's workflows,
          imagining both the patient and admin perspective. As a patient you can
          create new EHI export requests, check on in-progress exports, and
          download completed exports containing synthetic patient data directly
          onto your machine. As an admin you can review pending EHI export
          requests from users, upload attachments to include in EHI exports, and
          delete completed jobs directly from the EHI server. Click below to get
          started experimenting with both these user workflows.
        </p>
        <div className="mx-auto flex max-w-sm justify-between ">
          <LinkButton
            variant="emphasized"
            size="lg"
            to={`/jobs`}
            // open patient jobs list in a new tab if we're in the admin app
            target={isAdminRoute(window.location) ? "_blank" : ""}
          >
            Patient View
          </LinkButton>
          <LinkButton
            variant="emphasized"
            size="lg"
            // open admin jobs list in a new tab if we're in the patient app
            target={isAdminRoute(window.location) ? "" : "_blank"}
            to={`/admin/jobs`}
          >
            Admin View
          </LinkButton>
        </div>
      </section>
      <section id="about">
        <div>
          <HeadingOne>About EHI Export</HeadingOne>
        </div>
        <div className="space-y-4">
          <p>
            First signed into law in December 2016, the{" "}
            <a
              className="text-active underline"
              target="_blank"
              href="https://www.hhs.gov/ash/advisory-committees/tickbornedisease/about/21-century-cures-act/index.html"
              rel="noreferrer"
            >
              21st Century Cures Act
            </a>{" "}
            has significantly shifted the landscape of healthcare IT. Among
            these shifts, the Cures Act lays out a framework through which the
            Office of the Secretary of Health and Human Services (HHS), in
            practice through the Office of the National Coordinator for Health
            Information Technology (ONC), can mandate interoperability and
            penalize information blocking when it comes to electronic health
            information (EHI) sharing. With the passage of{" "}
            <a
              className="text-active underline"
              target="_blank"
              href="https://www.healthit.gov/topic/oncs-cures-act-final-rule"
              rel="noreferrer"
            >
              ONC's Cures Act Final Rule
            </a>
            {", "}
            those mandates and penalties have been put into writing. Simply put:
            not only are there rules requiring EHI sharing but there are
            consequences for blocking access to EHI, an enforcement mechanism
            that's essential in changing the health IT ecosystem's status quo.
          </p>
          <p>
            At the end of 2023 these information blocking rules will go into
            effect. In preparation for this, the healthcare standards community
            has been researching how to facilitate a smooth transition towards
            improved information sharing. Among Health Level Seven's Fast Health
            Interoperability Resources (HL7's FHIR) community, the Argonaut
            Project has devised{" "}
            <a
              className="text-active underline"
              target="_blank"
              href="https://build.fhir.org/ig/argonautproject/ehi-api/index.html"
              rel="noreferrer"
            >
              an implementation guide (IG)
            </a>{" "}
            for export electronic health information (EHI) from a hospital
            system using the FHIR standard, dubbed the EHI Export API. This
            application breathes life into the Argonaut's EHI Export IG,
            allowing the community to provide feedback and iterate on the
            standard's current specification.
          </p>
          <p>
            Visualizing a scenario in which patients request EHI exports from
            registered healthcare organizations, this web application is a
            modified version of the original{" "}
            <a
              className="text-active underline"
              target="_blank"
              href="https://docs.google.com/presentation/d/1-c6GcXrexCJhYzcmnQwbVuooZInG8ONfNyFbDzfFzyg/edit#slide=id.g123196c3949_1_140"
              rel="noreferrer"
            >
              App Flow
            </a>{" "}
            mocked up by the Argonaut team. To do so, we've implemented a
            web-based client of the EHI Export API, which can request exports,
            check on the status of pending exports, and download completed
            exports.
          </p>
          <p>
            In order to also explore the administration side of EHI export, this
            web application also introduces an admin mode for reviewing,
            augmenting via attachments, rejecting, and approving EHI requests.
            These operations are made via custom API calls directly between the
            admin application and the EHI-server, falling outside the purview of
            the EHI Export API specification. Together these patient and admin
            views provide a starting point for independent app developers
            building their own EHI export applications for patient's requesting
            their health information, for hospital systems to creating their own
            EHI export dashboards for managing export requests, and for the
            standards community in iterating on the current FHIR EHI Export API
            specification.
          </p>
          <p>
            As you experiment with the application, please report any issues or
            bugs as issues on our GitHub projects, links provided in the footer
            below. If you expand on this work, feel free to fork the project or
            star it for future reference.
          </p>
        </div>
      </section>
    </main>
  );
}
