import { Institution } from "../types";
import { EHISERVERFHIRURL } from "./constants";

export default async function getInstitutions(): Promise<Institution[]> {
  return [
    {
      displayName: "Boston Children's Hospital",
      imgUrl:
        "http://4.bp.blogspot.com/-vVLgy5iebg4/TkCYKBpHF6I/AAAAAAAAB6Y/-1Q-V85ymww/s1600/childrens_hospital_boston.jpg",
      fhirUrl: EHISERVERFHIRURL,
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
      imgUrl:
        "https://companieslogo.com/img/orig/DGX-9a3e04e0.png?t=1648572874",
      fhirUrl: "http://example.com/fhir",
      disabled: true,
    },
  ];
}
