const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`
const shades = (name, list) => Object.fromEntries(list.map(n => [n, v(`${name}-${n}`)]))

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Toutes les couleurs passent par des variables CSS (src/theme.css) :
      // le thème clair / sombre se change en une seule classe sur <html>.
      colors: {
        white: v('white'),
        navy: shades('navy', [950, 900, 800, 700, 600, 500, 400]),
        gold: shades('gold', [50, 100, 200, 300, 400, 500, 600, 700]),
        slate: shades('slate', [50, 100, 200, 300, 400, 500, 600, 700]),
        spirit: { ...shades('spirit', [400]), 500: '#8b5cf6' },
        emerald: shades('emerald', [200, 300, 400]),
        rose: shades('rose', [200, 300]),
        sky: shades('sky', [300]),
        amber: shades('amber', [300, 400]),
        red: shades('red', [400]),
        blue: shades('blue', [400]),
        orange: shades('orange', [400]),
        yellow: shades('yellow', [400]),
        indigo: shades('indigo', [400]),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(ellipse at top, #1a1200 0%, #070b14 70%)',
        'gradient-spiritual': 'linear-gradient(135deg, #070b14 0%, #0f1a2e 50%, #0a0e1e 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #f59e0b40, 0 0 10px #f59e0b20' },
          '100%': { boxShadow: '0 0 20px #f59e0b60, 0 0 40px #f59e0b30' },
        },
      },
    },
  },
  plugins: [],
}
