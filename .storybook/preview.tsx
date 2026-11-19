import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description:
        "App theme. Dark is the :root default; light is the .light class.",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["dark", "light"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "dark" },
  decorators: [
    (Story, context) => (
      <div className={context.globals.theme === "light" ? "light" : undefined}>
        <Story />
      </div>
    ),
  ],
};
export default preview;
