import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#131518",
        card: "#1c1f24",
        field: "#15171b",
        line: "#2d3239",
        "line-strong": "#3c424b",
        text: "#eceef1",
        muted: "#a0a7b0",
        accent: {
          DEFAULT: "#8ea6ff",
          hover: "#a9bbff",
          fg: "#10131c",
        },
        danger: "#ff9a90",
        success: "#6fcf97",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(142, 166, 255, 0.28)",
        "focus-danger": "0 0 0 3px rgba(255, 154, 144, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;