/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-gray-blue": "#a0aec0", // Add your custom color
        "custom-box-color": "#202c34",
        "custom-box-color-light": "#2A3944",
        "background-color": "#1a202c",
        "text-color": "#ffffff",
        "placeholder-color": "#a0aec0",
        "button-primary-color": "#4299e1",
        "button-secondary-color": "#4a5568",
        "button-hover-color": "#2b6cb0",
        "highlight-color": "#4299e1",
        "logout-color": "#f56565",
      },
      fontSize: {
        'custom-font-size-24': '1.5rem',
      },fontFamily: {
        sans: ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
