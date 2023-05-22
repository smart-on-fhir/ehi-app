import medLogo from "../assets/institution-logo.svg";
import { Institution } from "../types";

const staticInsitutions: Institution[] = [
  {
    displayName: "New York Gerontology Hospital",
    imgSrc: medLogo,
    fhirUrl: `${process!.env!.REACT_APP_EHI_SERVER}/fhir`,
    location: "211 Shortsteel Blvd New York, NY 10001",
    disabled: false,
  },
  {
    displayName: "Fana Darber",
    imgSrc: medLogo,
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Journey Assessments",
    imgSrc: medLogo,
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Billows Medicine",
    imgSrc: medLogo,
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Gram Typical Young Health",
    imgSrc: medLogo,
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
];

export function findMatchingInstitution(fhirUrl: string) {
  return staticInsitutions.find((i) => i.fhirUrl === fhirUrl);
}

export async function getInstitutions(): Promise<Institution[]> {
  return staticInsitutions;
}
