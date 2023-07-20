import type { Meta, StoryObj } from "@storybook/react";

import InstitutionOption from ".";

/**
 * An unordered list of institutions
 */
const meta: Meta<typeof InstitutionOption> = {
  component: InstitutionOption,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InstitutionOption>;

const simpleInstitutions = [
  {
    id: 0,
    displayName: "Default Institution",
    fhirUrl: "http://example.com",
    disabled: 0,
  },
  {
    id: 1,
    displayName: "Another Default Institution",
    fhirUrl: "http://example.com",
    disabled: 0,
  },
  {
    id: 2,
    displayName: "Hospital not-yet connected to the system",
    fhirUrl: "http://example.com",
    disabled: 1,
  },
  {
    id: 3,
    displayName: "Main St Hospital",
    location: "123 Main St, SomeTown USA",
    fhirUrl: "http://example.com",
    disabled: 0,
  },
];
const setInstitutionHandler = (inst: EHIApp.Institution) => {
  alert(
    `You've clicked the institution "${inst.displayName}".\nIn a real app this would trigger the smart auth handshake, but for now we'll just show this alert.`
  );
};

/**
 * An institution list with every kind of institution in it, also with enough elements to capture all weird border cases
 */
export const FullInstitutionList: Story = {
  args: {
    institutions: simpleInstitutions,
    setInstitution: setInstitutionHandler,
  },
};

/**
 * An institution list with one element
 */
export const SingleElementInstitutionList: Story = {
  args: {
    institutions: simpleInstitutions.slice(0, 1),
    setInstitution: setInstitutionHandler,
  },
};

/**
 * An institution list with two elements
 */
export const TwoElementInstitutionList: Story = {
  args: {
    institutions: simpleInstitutions.slice(0, 2),
    setInstitution: setInstitutionHandler,
  },
};

/**
 * What happens when the list of institutions is empty; for now render null
 */
export const EmptyInstitutionList: Story = {
  args: {
    institutions: [],
    setInstitution: setInstitutionHandler,
  },
};
