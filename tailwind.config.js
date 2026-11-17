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
    },
  },
  plugins: [],
}
