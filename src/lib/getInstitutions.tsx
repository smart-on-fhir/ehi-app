import { Institution } from "../types";

export default async function getInstitutions(): Promise<Array<Institution>> {
  return [
    {
      displayName: "Boston Children's Hospital",
      imgUrl:
        "http://4.bp.blogspot.com/-vVLgy5iebg4/TkCYKBpHF6I/AAAAAAAAB6Y/-1Q-V85ymww/s1600/childrens_hospital_boston.jpg",
      fhirUrl: "http://localhost:49632/fhir",
      location: "300 Longwood Avenue Boston, MA 02115",
      clickable: true,
    },
    {
      displayName: "Dana Farber",
      imgUrl:
        "http://www.dana-farberfriendsplace.org/uploads/1/1/7/8/117859188/s454818695208800432_c27_i3_w400.png",
      fhirUrl: "https://ehi-server.herokuapp.com/fhir",
      clickable: false,
    },
    {
      displayName: "Quest Diagnostics",
      imgUrl:
        "https://companieslogo.com/img/orig/DGX-9a3e04e0.png?t=1648572874",
      fhirUrl: "https://ehi-server.herokuapp.com/fhir",
      clickable: false,
    },
  ];
}
