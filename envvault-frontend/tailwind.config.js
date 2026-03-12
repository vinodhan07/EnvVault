/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#050505',
          surface: '#0E0E10',
          surfaceHover: '#161618',
          border: '#222224',
          textMain: '#FFFFFF',
          textMuted: '#888899',
          neonLime: '#D4FF00',
          neonLimeDark: '#B2D600',
          neonCyan: '#00E5FF',
          neonMagenta: '#FF0055'
        }
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        sans: ['"Sora"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-lime': '0 0 15px rgba(212, 255, 0, 0.4)',
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.4)',
        'neon-magenta': '0 0 15px rgba(255, 0, 85, 0.4)',
        'brutal': '4px 4px 0px rgba(212, 255, 0, 1)',
        'brutal-cyan': '4px 4px 0px rgba(0, 229, 255, 1)',
        'brutal-magenta': '4px 4px 0px rgba(255, 0, 85, 1)',
        'brutal-dark': '4px 4px 0px rgba(34, 34, 36, 1)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 15s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
