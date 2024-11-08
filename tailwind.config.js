/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFB800', // Yellow from logo/header
          dark: '#E6A600',
        },
        secondary: '#8CC63F', // Green from grass
        accent: {
          blue: '#87CEEB', // Sky blue
          green: '#8CC63F', // Green from grass
        },
        background: '#F5F5F5',
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F0F0F0',
        },
        text: {
          DEFAULT: '#333333',
          secondary: '#666666',
        }
      },
      backgroundImage: {
        'golf-pattern': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.432 0 0 13.432 0 30c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C60 13.432 46.568 0 30 0zm0 45c-8.284 0-15-6.716-15-15 0-8.284 6.716-15 15-15 8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15z' fill='%238CC63F' fill-opacity='0.05'/%3E%3C/svg%3E')",
      },
      boxShadow: {
        'glow': '0 4px 14px rgba(255, 184, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
