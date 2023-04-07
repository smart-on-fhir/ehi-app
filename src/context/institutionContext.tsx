import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { Institution } from "../types";

interface InstitutionContextInterface {
  institution: Institution | null;
  setInstitution: Dispatch<SetStateAction<Institution | null>>;
}

type InstitutionProviderProps = {
  children: ReactNode;
};

let InstitutionContext = createContext<InstitutionContextInterface>(null!);

export function InstitutionProvider({ children }: InstitutionProviderProps) {
  const [institution, setInstitution] = useState<Institution | null>(null);

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
  return useContext(InstitutionContext);
}
