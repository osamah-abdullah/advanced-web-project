/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-gray-blue": "#a0aec0", // Add your custom color
      }
    },
  },
  plugins: [],
};

