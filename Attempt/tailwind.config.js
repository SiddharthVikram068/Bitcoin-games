/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d4f1b0", // Light green background
        secondary: {
          DEFAULT: "#2e8b57", // Main green color
          100: "#3cb371", // Lighter shade of green
          200: "#228b22", // Darker shade of green
        },
        black: {
          DEFAULT: "#003300", // Dark green for text
          100: "#336633", // Slightly lighter dark green
          200: "#669966", // Even lighter dark green
        },
        gray: {
          100: "#ccc", // Light gray for borders and backgrounds
        },
        whitishGreen: "#f0fff0", // Whitish green color
      },
      fontFamily: {
        // Your existing font families remain the same
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        rearth: ["RegularEarth-lrrD", "sans-serif"],
        rearthnos: ["RegularEarthNos-nKKV", "sans-serif"],
        moonkids: ["MoonkidsPersonalUseExtbd-gxPZ3", "sans-serif"],
      },
    },
  },
  plugins: [],
};
