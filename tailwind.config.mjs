/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0b10',
        surface: '#12141d',
        'surface-hover': '#1a1d29',
        card: '#161824',
        border: '#25293d',
        // Update primary to Beluga App Orange palette (#ff6600 base)
        primary: {
          50: '#fff9f5',
          100: '#ffede0',
          200: '#ffd6bb',
          300: '#ffb588',
          400: '#ff8a4c',
          500: '#ff6600', // Main brand orange
          600: '#e05300',
          700: '#bb3d00',
          800: '#963200',
          900: '#7a2b02',
          950: '#421300',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"WenQuanYi Micro Hei"',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
