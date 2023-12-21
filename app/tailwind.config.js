// import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   transparent: "transparent",
    //   current: "currentColor",
    //   black: colors.black,
    //   white: colors.white,
    //   gray: colors.gray,
    //   emerald: colors.emerald,
    //   indigo: colors.indigo,
    //   yellow: colors.yellow,
    //   gameBlue: {
    //     100: "#C2F2FF",
    //     200: "#00bFF2",
    //     300: "#00607A",
    //   },
    //   gameOrange: {
    //     100: "#FEE9C2",
    //     200: "#FBAC18",
    //     300: "#A16902",
    //   },
    // },
    extend: {
      rotate: {
        15: "15deg",
        30: "30deg",
      },
    },
  },
  plugins: [],
};
