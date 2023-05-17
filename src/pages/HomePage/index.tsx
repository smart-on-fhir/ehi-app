import HeadingOne from "../../components/HeadingOne";
import LinkButton from "../../components/LinkButton";

export default function Home() {
  return (
    <main>
      {/* <h1 className="mx-auto mb-8 text-center text-4xl"> EHI Export</h1> */}

      <div className="flex items-baseline justify-between">
        <HeadingOne>EHI Export Demonstration</HeadingOne>
        <LinkButton variant="emphasized" size="lg" to="/jobs">
          Visit Demo
        </LinkButton>
      </div>
      <div className="space-y-4">
        <p>
          First signed into law in December 2016, the{" "}
          <a
            className="cursor-pointer text-active underline"
            href="https://www.hhs.gov/ash/advisory-committees/tickbornedisease/about/21-century-cures-act/index.html"
          >
            21st Century Cures Act
          </a>{" "}
          has significantly shifted the landscape of healthcare IT. Among these
          shifts, the Cures Act lays out a framework through which the Office of
          the Secretary of Health and Human Services (HHS), in practice through
          the Office of the National Coordinator for Health Information
          Technology (ONC), can mandate interoperability and penalize
          information blocking when it comes to electronic health information
          (EHI) sharing. With the passage of{" "}
          <a
            className="cursor-pointer text-active underline"
            href="https://www.healthit.gov/topic/oncs-cures-act-final-rule"
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
            className="cursor-pointer text-active underline"
            href="https://build.fhir.org/ig/argonautproject/ehi-api/index.html"
          >
            an implementation guide (IG)
          </a>{" "}
          for the export of electronic health information (EHI) from a hospital
          system using the FHIR standard. This EHI Export Demonstration breathes
          life into the Argonaut's EHI Export IG, allowing the community to
          provide feedback and iterate on the standard's current specification.
        </p>
        <p>
          Visualizing a scenario in which patients request EHI exports from
          registered healthcare organizations, this web application is a
          modified version of the original App Flow mocked up by the Argonaut's
          team. In order to explore the administration side of EHI export, our
          application also introduces pages and operations for reviewing,
          augmenting, rejecting, and approving EHI requests. In tandem with a
          project implementing an EHI backend server, this application provides
          a starting point for hospital systems to build their own EHI export
          interfaces and for the standards community to iterate on the current
          FHIR EHI export specification.
        </p>
        <p>
          As you experiment with the application, please report any issues or
          bugs as issues on our GitHub projects. If you find yourself expanding
          on this work, feel free to fork the project or star it for future
          reference.
        </p>
      </div>
    </main>
  );
}
