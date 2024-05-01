import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        //sans: ['var(--font-sans)'],
        //mono: ['var(--font-mono)'],
        instrumentSans: ['Instrument Sans', 'sans-serif'],
        materialSymbolsOutlined: ['Material Symbols Outlined', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        robotoSlab: ['Roboto Slab', 'serif'],
        robotoMono: ['Roboto Mono', 'monospace'],
        robotoMono2: ['Roboto Mono', 'monospace'],
      },
      colors: {
        gray1: '#121212',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Add this line
};

export default config;
