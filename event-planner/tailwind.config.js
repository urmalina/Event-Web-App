/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-sans)', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };