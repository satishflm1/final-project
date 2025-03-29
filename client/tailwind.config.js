module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD1C2',
          300: '#FFB199',
          400: '#FF8B66',
          500: '#FF6B3D', // Main orange
          600: '#FF4D1A',
          700: '#E63900',
          800: '#B32D00',
          900: '#802000',
        },
        gray: {
          100: '#F8F9FA',
          200: '#F1F3F5',
          300: '#E9ECEF',
          400: '#DEE2E6',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        amber: '#FC8019', // Amber Sae - Accent
        green: '#09AA29', // Green Pantone - Pop
        linen: '#FFF2E8', // Linen - Highlight
        raisin: '#171526', // Raisin Black - Type Dark
        spanish: '#9F9F9E', // Spanish Gray - Type Faded
        cultured: '#F5F5F5', // Cultured White - Separators
      },
      textColor: {
        dark: '#171526', // Raisin Black for text
        faded: '#9F9F9E', // Spanish Gray for faded text
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['34px', { fontWeight: '800' }], // Extra Bold
        'h2': ['30px', { fontWeight: '600' }], // Semi Bold
        'h3': ['24px', { fontWeight: '600' }], // Semi Bold
        'h4': ['20px', { fontWeight: '600' }], // Semi Bold
        'h5': ['16px', { fontWeight: '600' }], // Semi Bold
        'p1': ['20px', { fontWeight: '500' }], // Medium
        'p2': ['16px', { fontWeight: '400' }], // Regular
        'p3': ['14px', { fontWeight: '400' }], // Regular
        'caption': ['12px', { fontWeight: '500' }], // Medium
      },
      backgroundColor: {
        'pos': '#FF6B3D', // Main orange
        'sidebar': '#F8F9FA', // Light gray sidebar
        'accent': '#FC8019', // Amber Sae
        'pop': '#09AA29', // Green Pantone
        'highlight': '#FFF2E8', // Linen
        'dark': '#171526', // Raisin Black
        'faded': '#9F9F9E', // Spanish Gray
        'separator': '#F5F5F5', // Cultured White
      }
    },
  },
  plugins: [],
} 