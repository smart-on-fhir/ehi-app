import type { Meta, StoryObj } from "@storybook/react";

import InstitutionOption from ".";

/**
 * An list-item representation of an institution;
 * NOTE: the border is driven by container-class styling, not by the institutionOption itself
 */
const meta: Meta<typeof InstitutionOption> = {
  component: InstitutionOption,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ul className="rounded border border-gray-600">
        <Story />
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InstitutionOption>;

const setInstitutionHandler = (inst: EHIApp.Institution) => {
  alert(
    `You've clicked the institution "${inst.displayName}".\nIn a real app this would trigger the smart auth handshake, but for now we'll just show this alert.`
  );
};

export const DefaultInstitutionOption: Story = {
  args: {
    institution: {
      id: 1,
      displayName: "Default Institution",
      fhirUrl: "http://example.com",
      disabled: 0,
    },
    setInstitution: setInstitutionHandler,
  },
};

/**
 * A disabled option in the list
 */
export const DisabledInstitutionOption: Story = {
  args: {
    institution: {
      id: 1,
      displayName: "Hospital not-yet connected to the system",
      fhirUrl: "http://example.com",
      disabled: 1,
    },
    setInstitution: setInstitutionHandler,
  },
};

/**
 * For illustrating how locations are represented centering in-action
 */
export const InstitutionOptionWithLocation: Story = {
  args: {
    institution: {
      id: 1,
      displayName: "Main St Hospital",
      location: "123 Main St, SomeTown USA",
      fhirUrl: "http://example.com",
      disabled: 0,
    },
    setInstitution: setInstitutionHandler,
  },
};
