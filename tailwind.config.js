/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind / NativeWind where all your code lives
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./**/*.test.{js,jsx,ts,tsx}", // test files
    "./**/*.spec.{js,jsx,ts,tsx}", // spec files
    // If you also use files under my-expo-app/ uncomment the next line
    // "./my-expo-app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
