import type { Meta, StoryObj } from "@storybook/react";

import ErrorMessage from ".";

/**
 * A common utility for displaying errors
 */
const meta: Meta<typeof ErrorMessage> = {
  component: ErrorMessage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

/**
 * A typical error message
 */
export const DefaultErrorMessage: Story = {
  args: {
    display: "Error Title",
    error: new Error("This is the content of the error"),
  },
};

/**
 * An error with ridiculously long display
 */
export const LongTitleErrorMessage: Story = {
  args: {
    display:
      "This is an error with a ridiculously long title; This is an error with a ridiculously long title; This is an error with a ridiculously long title; This is an error with a ridiculously long title;  This is an error with a ridiculously long title; This is an error with a ridiculously long title; ",
    error: new Error("This is the content of the error"),
  },
};

/**
 * What the typical error message looks like
 */
export const LongContentErrorMessage: Story = {
  args: {
    display: "This is an error with a ridiculously long message.",
    error:
      new Error(`Aliquip ad incididunt ut ex. Magna laboris excepteur exercitation aute deserunt Lorem consectetur Lorem. Enim adipisicing irure cillum ad nisi dolore labore nisi aute consectetur mollit eiusmod non. Ut et occaecat qui est esse est deserunt eiusmod cillum incididunt occaecat magna nostrud laboris. Ex aute duis irure excepteur et officia irure ut labore fugiat culpa aliqua. Incididunt nulla dolor eiusmod aliquip ea dolor magna.

Et ut cillum aliquip commodo nostrud veniam ex mollit. Eu magna eu incididunt anim sit est cillum dolor et incididunt elit officia et dolor. Ut laboris commodo adipisicing eiusmod enim tempor culpa veniam cillum do sint.

Nostrud proident anim dolor anim irure Lorem sunt officia et incididunt. Id do elit enim ex consequat ut proident ipsum in duis magna ut. Occaecat nulla mollit tempor commodo laboris Lorem. Cillum reprehenderit quis enim nulla ex ex officia in reprehenderit magna elit. Ullamco nulla cupidatat occaecat qui quis exercitation deserunt ex.

Laborum irure reprehenderit id quis duis eiusmod nisi sint pariatur incididunt laborum. Qui deserunt elit dolore esse. Labore magna labore aute exercitation labore mollit amet occaecat fugiat. Labore commodo do eiusmod laboris sint Lorem sint incididunt officia ullamco nulla sint cillum.`),
  },
};
