/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.13 0.005 260)',
        foreground: 'oklch(0.95 0 0)',
        sidebar: 'oklch(0.17 0.005 260)',
        border: 'oklch(0.28 0.005 260)',
        input: 'oklch(0.22 0.005 260)',
        primary: 'oklch(0.65 0.2 250)',
        accent: 'oklch(0.35 0.01 260)',
        muted: 'oklch(0.25 0.005 260)',
        'muted-foreground': 'oklch(0.65 0 0)',
        'message-sent': 'oklch(0.55 0.18 250)',
        'message-received': 'oklch(0.30 0.01 260)',
        online: 'oklch(0.72 0.19 145)',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
