import type { Meta, StoryObj } from "@storybook/react";

import SpinningLoader from ".";

/**
 * A horizontally-centered spinner for loading
 */
const meta: Meta<typeof SpinningLoader> = {
  component: SpinningLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpinningLoader>;

export const DefaultSpinningLoader: Story = {
  args: {
    label: "Spinner label for screen reader",
  },
};

/**
 * For illustrating the horizontal centering in-action
 */
export const LoaderWithBorders: Story = {
  args: {
    label: "Spinner label for screen reader",
  },
  decorators: [
    (Story) => (
      <div className="w-48 border ">
        <Story />
      </div>
    ),
  ],
};
