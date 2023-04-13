import { Institution } from "../types";
import { EHI_SERVER_FHIR_URL, LOCAL_EHI_SERVER_FHIR_URL } from "./constants";

const staticInsitutions: Institution[] = [
  {
    displayName: "Boston Children's Hospital",
    imgUrl:
      "http://4.bp.blogspot.com/-vVLgy5iebg4/TkCYKBpHF6I/AAAAAAAAB6Y/-1Q-V85ymww/s1600/childrens_hospital_boston.jpg",
    fhirUrl: EHI_SERVER_FHIR_URL,
    location: "300 Longwood Avenue Boston, MA 02115",
    disabled: false,
  },
  {
    displayName: "Dana Farber",
    imgUrl:
      "http://www.dana-farberfriendsplace.org/uploads/1/1/7/8/117859188/s454818695208800432_c27_i3_w400.png",
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
  {
    displayName: "Quest Diagnostics",
    imgUrl: "https://companieslogo.com/img/orig/DGX-9a3e04e0.png?t=1648572874",
    fhirUrl: "http://example.com/fhir",
    disabled: true,
  },
];

if (process.env.NODE_ENV === "development") {
  staticInsitutions.unshift({
    displayName: "TESTING: Localhost server",
    imgUrl:
      "https://w7.pngwing.com/pngs/709/429/png-transparent-font-awesome-computer-icons-font-cogs-black-and-white-tab-symbol-thumbnail.png",
    fhirUrl: LOCAL_EHI_SERVER_FHIR_URL,
    location: "3005 Nowhere Drive, Gonesville MA, -90210",
    disabled: false,
  });
}

export function findMatchingInstitution(fhirUrl: string) {
  return staticInsitutions.find((i) => i.fhirUrl === fhirUrl);
}

export async function getInstitutions(): Promise<Institution[]> {
  return staticInsitutions;
}
