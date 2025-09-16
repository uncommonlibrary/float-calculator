/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 10"', "sans-serif"],
      },
    },
  },
  plugins: [],
  // To prevent Tailwind from overriding font families
  corePlugins: {
    fontFamily: false,
  },
};
