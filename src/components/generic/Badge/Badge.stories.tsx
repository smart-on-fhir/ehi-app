import type { Meta, StoryObj } from "@storybook/react";

import Badge from ".";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const SimpleBadge: Story = {
  args: {
    display: "Some text",
  },
};

export const DetailedBadge: Story = {
  args: {
    display: "Some text",
    detailedInformation:
      "This text provides more context for users that hover over the badge icon",
  },
};

export const CustomizedBadge: Story = {
  args: {
    display: "Some text",
    detailedInformation:
      "This text provides more context for users that hover over the badge icon",
    className: "m-8",
  },
};
