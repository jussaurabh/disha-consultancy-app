import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description:
        "App theme. Light is the :root default; dark is the .dark class (mirrors src/index.css). Applied on <html> so Radix portals render in the right register.",
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
    (Story, context) => {
      const theme = context.globals.theme === "light" ? "light" : "dark";
      // Toggle .dark on <html> — tokens under `.dark` and the dark: variant
      // then reach portal-rendered panels (Select, Popover) as well.
      useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        return () => document.documentElement.classList.remove("dark");
      }, [theme]);
      return <Story />;
    },
  ],
};
export default preview;
