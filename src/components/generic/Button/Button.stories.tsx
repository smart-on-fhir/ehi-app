import type { Meta, StoryObj } from "@storybook/react";

import Button from ".";

/**
 * The various kinds of buttons you'll see across the application
 */
const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
  },
};

export const EmphasizedButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
    variant: "emphasized",
  },
};

export const DangerButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
    variant: "danger",
  },
};

export const LargeButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
    size: "lg",
  },
};

export const DisabledButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
    disabled: true,
  },
};

/**
 * Illustrating that `disabled` styles override `variant` styles
 */
export const DisabledEmphasizedButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: "Click here",
    disabled: true,
    variant: "emphasized",
  },
};

/**
 * Illustrating that Children can be any React.ReactNode type object, including a component
 */
export const ChildComponentButton: Story = {
  args: {
    onClick: () => alert("button was clicked"),
    children: (
      <div>
        <h1>This is a heading tag</h1>
        <ul>
          <li></li>
        </ul>
      </div>
    ),
  },
};
