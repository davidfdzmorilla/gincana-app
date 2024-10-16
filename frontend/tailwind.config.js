/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg) translateY(0)' },
          '25%': { transform: 'rotate(1deg) translateY(-5px)' },
          '50%': { transform: 'rotate(-1deg) translateY(0)' },
          '75%': { transform: 'rotate(1deg) translateY(5px)' },
          '100%': { transform: 'rotate(0deg) translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'skewY(0deg)' },
          '25%': { transform: 'skewY(2deg)' },
          '50%': { transform: 'skewY(-2deg)' },
          '75%': { transform: 'skewY(2deg)' },
          '100%': { transform: 'skewY(0deg)' },
        },
      },
      animation: {
        wave: 'wave 5s ease-in-out infinite',
        ripple: 'ripple 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
