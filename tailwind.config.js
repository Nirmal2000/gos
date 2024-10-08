/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(270.33deg, #2B5482 23.23%, #2E387A 82.13%)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        brunoAce: ['var(--font-bruno-ace)', 'sans-serif'],
        lufga: ['var(--font-lufga)', 'sans-serif'],
        abeeZee: ['var(--font-abeezee)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
