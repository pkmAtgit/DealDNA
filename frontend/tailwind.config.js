/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0f2942",
          800: "#122d4f",
        },
        brand: {
          blue: "#1967fe",
        }
      }
    },
  },
  plugins: [],
};
