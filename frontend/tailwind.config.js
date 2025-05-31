/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "retro"],
  },
}

export default config;
