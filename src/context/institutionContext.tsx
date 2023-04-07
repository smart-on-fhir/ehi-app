import * as React from "react";
import { Institution } from "../types";

interface InstitutionContextInterface {
  institution: Institution | null;
  setInstitution: (i: Institution) => void;
}

type InstitutionProviderProps = {
  children: React.ReactNode;
};

let InstitutionContext = React.createContext<InstitutionContextInterface>(
  null!
);

export function InstitutionProvider({ children }: InstitutionProviderProps) {
  const [institution, setInstitution] = React.useState<Institution | null>(
    null
  );

  return (
    <InstitutionContext.Provider
      value={{
        institution,
        setInstitution,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitutionContext() {
  return React.useContext(InstitutionContext);
}
