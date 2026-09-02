/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0A0A',
          card: '#141414',
          border: '#2A2A2A',
          divider: '#333333',
        },
        arc: {
          red: '#CC0000',
          'red-hover': '#FF1A1A',
          'red-bg': '#2D0000',
          'red-border': '#660000',
          yellow: '#FFC107',
          'yellow-hover': '#FFD54F',
          'yellow-bg': '#2D2600',
          'yellow-border': '#664D00',
        },
        ink: {
          white: '#F5F5F5',
          muted: '#888888',
        },
        pass: {
          border: '#1A2A1A',
          text: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
