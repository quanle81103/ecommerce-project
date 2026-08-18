/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Đảm bảo có dòng này để quét qua các file React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}