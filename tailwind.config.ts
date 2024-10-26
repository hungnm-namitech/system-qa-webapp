import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { nextui } from '@nextui-org/react';
import { act } from 'react';
const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      'noto-san-jp': ['Noto Sans JP', 'sans-serif'],
      sans: ['Helvetica', 'Arial', 'sans-serif'],
    },
    screens: {
      tablet: '750px',
      pc: '1200px',
      xlpc: '1440px',
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: '#1B2245',
        secondary: '#1A0DAB',
        required: '#CF0944',
        gray: '#ccc',
        skyblue: '#36BFB7',
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
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        'noto-san-jp': ['Noto Sans JP', 'sans-serif'],
      },
      keyframes: {
        slideright: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(115%)' },
        },
        slideleft: {
          '0%': { transform: 'translateX(115%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceinfwd: {
          '0%': {
            transform: 'scale(0)',

            'animation-timing-function': 'ease-in',
            opacity: '0',
          },
          '38%': {
            transform: 'scale(1)',

            'animation-timing-function': 'ease-out',
            opacity: '1',
          },
          '55%': {
            transform: 'scale(0.7)',

            'animation-timing-function': 'ease-in',
          },
          '72%': {
            transform: 'scale(1)',

            'animation-timing-function': 'ease-out',
          },
          '81%': {
            transform: 'scale(0.84)',

            'animation-timing-function': 'ease-in',
          },
          '89%': {
            transform: 'scale(1)',

            'animation-timing-function': 'ease-out',
          },
          '95%': {
            transform: 'scale(0.95)',

            'animation-timing-function': 'ease-in',
          },
          '100%': {
            transform: 'scale(1)',

            'animation-timing-function': 'ease-out',
          },
        },
        progress: {
          '0%': { transform: ' translateX(0) scaleX(0)' },
          '40%': { transform: 'translateX(0) scaleX(0.4)' },
          '100%': { transform: 'translateX(100%) scaleX(0.5)' },
        },
      },
      animation: {
        'slide-right': 'slideright 0.5s both',
        'slide-left': 'slideleft 0.5s both',
        'slide-end': 'slideend 0.5s both',
        'bounce-in-fwd': 'bounceinfwd 1.1s both',
        progress: 'progress 1s infinite linear',
      },
      minHeight: {
        tablet: 'calc(100vh - 65px)',
      },
      boxShadow: {
        form: '1px 4px 6px 0px #DADEF0E5',
      },
      transformOrigin: {
        'left-right': '0% 50%',
      },
    },
  },
  plugins: [
    nextui(),
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
        },
        '.break-anywhere': {
          'overflow-wrap': 'anywhere',
        },
      });
    }),
  ],
} satisfies Config;

export default config;
