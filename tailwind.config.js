/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#070B14',
          raised: '#0B111D',
          surface: '#0F1726',
          card: '#131C2E',
          border: 'rgba(148, 163, 197, 0.12)',
          borderStrong: 'rgba(148, 163, 197, 0.22)',
        },
        ink: {
          primary: '#E7ECF6',
          secondary: '#9AA6BD',
          tertiary: '#6B7690',
          faint: '#4B5468',
        },
        accent: {
          indigo: '#6C7CF6',
          blue: '#4C8DF6',
          cyan: '#3FD6E0',
          violet: '#8B7CF6',
        },
        state: {
          critical: '#F0637A',
          high: '#F6A65B',
          medium: '#4C8DF6',
          low: '#5FB88A',
          success: '#4ADE9A',
          warning: '#F3B65C',
          danger: '#F0637A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 30px -18px rgba(0,0,0,0.65)',
        raised: '0 20px 45px -20px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(108,124,246,0.25), 0 8px 24px -6px rgba(108,124,246,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl2: '1.1rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
