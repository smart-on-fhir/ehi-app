// import medLogo from "../assets/institution-logo.svg";
import { Institution } from "../types";

export async function getInstitutions(): Promise<Institution[]> {
  return fetch("/api/institutions").then((resp) => resp.json());
}
