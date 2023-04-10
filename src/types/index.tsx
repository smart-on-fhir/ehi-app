export interface Institution {
  // The name of the institution, for use in visual displays
  displayName: string;
  // A URL pointing to a small, square image to be used as the institution's logo
  imgUrl: string;
  // Where the institution is located, represented as a one-line string
  location?: string;
  // A URL pointing to this institution's FHIR server
  fhirUrl: string;
  // Whether or not this institution should be displayed in the UI
  disabled: boolean;
}
