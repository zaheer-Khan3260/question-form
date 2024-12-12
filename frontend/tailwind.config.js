/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "primary-background": "#1A1C22",
        "secondry-background": "#2A2C3C",
        "third-background":"#1F2229"
      },
      textColor: {
        "primary-color": "#63656D",
        "hover-color": "#2A2C3C",
      },
    },
  },
  plugins: [],
}