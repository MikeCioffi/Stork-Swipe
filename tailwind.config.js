module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'french-pass': {
          DEFAULT: '#BDE0FE',
          '50': '#EAF4FF',
          '100': '#E5F1FF',
          '200': '#DBEDFE',
          '300': '#D1E8FE',
          '400': '#C7E4FE',
          '500': '#BDE0FE',
          '600': '#A9D8FE',
          '700': '#95D0FD',
          '800': '#81C9FD',
          '900': '#6DC3FD'
        },
        'pastel-pink': {
          DEFAULT: '#FFC8DD',
          '50': '#FFF6F9',
          '100': '#FFF1F6',
          '200': '#FFE7F0',
          '300': '#FFDCEA',
          '400': '#FFD2E3',
          '500': '#FFC8DD',
          '600': '#FFBED7',
          '700': '#FFB4D0',
          '800': '#FFA9CA',
          '900': '#FF9FC4'
        },
      }
    },
  },
  plugins: [],
}