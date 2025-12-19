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
            Beginning December 31, 2023, patients can request and receive a
            complete copy of their electronic health information (EHI) and
            providers will be able to export the full content of their EHR when
            switching systems. The 21st Century Cures Act requires that EHR
            developers “will not take any action . . . that may inhibit the
            appropriate exchange, access, and use of electronic health
            information”. The Office of the National Coordinator of Health
            Information Technology (ONC)'s 21st Century Cures Act Final Rule
            implements aspects of several Cures Act provisions, among them
            enabling EHI export. Though EHRs are required to support an
            application programming interface (API) for both single patient and
            bulk export of a subset of data called the US Core for Data
            Interoperability (USCDI), the 'full' EHI export does not require an
            API, but simply that the export be provided in a computable,
            electronic format whose documentation is available via hyperlink.
          </p>
          <p>
            For patient access to EHI, the Cures Act Final Rule provisions
            become much more powerful if a patient can use an app to make an API
            request for their complete EHI. This enables many use cases, from
            sharing healthcare data with a clinician, to using artificial
            intelligence-based processes to provide personalized decision
            support, to data donation for research and innovation. To that end,
            and with enthusiasm expressed by ONC, the{" "}
            <a
              href="www.smarthealthit.org"
              target="_blank"
              className="text-active underline"
              rel="noreferrer"
            >
              SMART Health IT team
            </a>{" "}
            proposed and helped lead development of a standards-based EHI export
            API specification as part of the Argonaut Project standards
            accelerator. The workgroup produced the{" "}
            <a
              href="https://build.fhir.org/ig/argonautproject/ehi-api/ehi-export.html"
              target="_blank"
              className="text-active underline"
              rel="noreferrer"
            >
              EHI Export API draft implementation guide
            </a>
            , a flexible FHIR based API to enable patients to access and share
            their EHI using third party applications connecting to EHRs.
          </p>
          <p>
            This app implements a web-based client of the EHI Export API, which
            can request exports, check on the status of pending exports, and
            download completed exports. Visualizing a scenario in which patients
            request EHI exports from registered healthcare organizations, this
            web application is a modified version of the original{" "}
            <a
              href="https://docs.google.com/presentation/d/1-c6GcXrexCJhYzcmnQwbVuooZInG8ONfNyFbDzfFzyg/edit#slide=id.g123196c3949_1_140"
              target="_blank"
              className="text-active underline"
              rel="noreferrer"
            >
              App Flow
            </a>{" "}
            mocked up by the Argonaut team. In order to also explore the
            administration side of EHI export, this web application also
            introduces an admin mode for reviewing, augmenting via attachments,
            rejecting, and approving EHI requests. These admin operations are
            made via custom API calls directly between the admin application and
            the EHI-server, falling outside the purview of the EHI Export API
            specification.
          </p>
          <p>
            Together these patient and admin views provide a starting point for
            independent app developers building their own EHI export
            applications for patient's requesting their health information, for
            hospital systems to creating their own EHI export dashboards for
            managing export requests, and for the standards community in
            iterating on the current FHIR EHI Export API specification. As you
            experiment with the application, please report any issues or bugs as
            issues on our GitHub projects, links provided in the footer below.
            If you expand on this work, feel free to fork the project or star it
            for future reference.
          </p>
        </div>
      </section>
    </main>
  );
}
