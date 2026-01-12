/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        base: '#070b12',
        panel: '#0e1421',
        stroke: 'rgba(255,255,255,0.08)',
        accent: '#5ab0ff',
        accent2: '#7ed0c0',
        muted: '#9baac0',
        text: '#e4eaf5',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0,0,0,0.28)',
      },
    },
  },
  plugins: [],
};
