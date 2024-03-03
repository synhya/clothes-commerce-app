import type { Config } from 'tailwindcss';
import { fontFamily } from "tailwindcss/defaultTheme"
import { nextui } from '@nextui-org/react';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true, // default: false
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      sans: [
        'var(--font-sans)',
        'Helvetica Neue',
        'Apple SD Gothic Neo',
        'Malgun Gothic',
        '맑은고딕',
        'Dotum',
        '돋움',
        'Gulim',
        '굴림',
        'Helvetica',
        'Arial',
        'sans-serif',
      ],
      mono: [
        'var(--font-mono)',
        'ui-monospace',
        'Consolas',
        'SFMono-Regular',
        'Liberation Mono',
        'Menlo',
        'Monaco',
        'Courier',
        'Apple SD Gothic Neo',
        'Nanum Gothic',
        '나눔고딕',
        'Malgun Gothic',
        '맑은고딕',
        'monospace',
        'NerdFontsSymbols Nerd Font',
      ],
      header: ["var(--font-header)", ...fontFamily.sans],
    },
    extend: {
      screens: {
        'nav-md': '978px',
        xs: '480px',
        xxs: '380px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--cards))',
          foreground: 'hsl(var(--cards-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), nextui()],
} satisfies Config;


export default config;
