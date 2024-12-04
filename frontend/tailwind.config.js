/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#038C8C',
          dark: '#025159',
          light: '#03A696',
        },
        accent: {
          DEFAULT: '#F28705',
        },
        secondary: {
          DEFAULT: '#025159',
          dark: '#012E40',
          light: '#038C8C',
        },
        background: {
          DEFAULT: '#012E40',
          light: '#03A696',
          dark: 'black',
        },
        text: {
          primary: '#038C8C',
          secondary: '#F28705',
        },
      },
    },
  },
  plugins: [],
};
