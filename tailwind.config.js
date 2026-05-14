/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lion-orange': '#FF7710',
        'lion-orange-dark': '#E66309',
        'lion-black': '#1F2937',
        'lion-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
        },
        'status': {
          'late': '#EAB308',
          'late-reason': '#F97316',
          'absent': '#EF4444',
          'absent-excused': '#4B5563',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
