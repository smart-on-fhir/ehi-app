import bchLogo from "../assets/bch.png";
import { Institution } from "../types";

const staticInsitutions: Institution[] = [
  {
    displayName: "Boston Children's Hospital",
    imgSrc: bchLogo,
    fhirUrl: `${process!.env!.REACT_APP_EHI_SERVER}/fhir`,
    location: "300 Longwood Avenue Boston, MA 02115",
    disabled: false,
  },
  {
    displayName: "Dana Farber",
    imgSrc:
      "http://www.dana-farberfriendsplace.org/uploads/1/1/7/8/117859188/s454818695208800432_c27_i3_w400.png",
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Quest Diagnostics",
    imgSrc: "https://companieslogo.com/img/orig/DGX-9a3e04e0.png?t=1648572874",
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Tufts Medicine",
    imgSrc:
      "https://www.tuftsmedicine.org/sites/default/files/2022-03/tuftsmedicine_icon_blue_rgb.svg",
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Mass General Brigham",
    imgSrc:
      "https://innovation.massgeneralbrigham.org/wp-content/uploads/2020/09/mgb-icon-color@2x.png",
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
