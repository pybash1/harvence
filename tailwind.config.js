import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3355ff",
      },
      fontFamily: {
        plain: ["Plain-Regular", ...fontFamily.sans],
        plainMeduim: ["Plain-Medium", ...fontFamily.sans],
        plainBold: ["Plain-Bold", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
