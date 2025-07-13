// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    // Optional: include node_modules if using SUI from there
    "./node_modules/@shadcn/ui/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

