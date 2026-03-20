/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper:   '#E8E4DD',
        signal:  '#E63B2E',
        offwhite:'#F5F3EE',
        ink:     '#111111',
        slate:   '#1E1E1E',
        muted:   '#6B6B6B',
      },
      fontFamily: {
        sans:  ['"Space Grotesk"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
        mono:  ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}
