/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-shift': 'gradient-shift 20s ease infinite',
        'light-ray-1': 'light-ray-1 8s ease-in-out infinite',
        'light-ray-2': 'light-ray-2 10s ease-in-out infinite',
        'noise': 'noise 8s steps(10) infinite',
        'horizon-glow': 'horizon-glow 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'fog-drift-1': 'fog-drift-1 25s ease-in-out infinite',
        'fog-drift-2': 'fog-drift-2 30s ease-in-out infinite',
        'smoke-rise-1': 'smoke-rise-1 20s ease-in-out infinite',
        'smoke-rise-2': 'smoke-rise-2 25s ease-in-out infinite',
        'cloud-shadow': 'cloud-shadow 40s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
            'background-size': '200% 200%',
          },
          '50%': {
            'background-position': '100% 50%',
            'background-size': '250% 250%',
          },
        },
        'light-ray-1': {
          '0%, 100%': {
            opacity: '0.15',
            transform: 'translateX(-20px) rotate(12deg)',
          },
          '50%': {
            opacity: '0.25',
            transform: 'translateX(20px) rotate(12deg)',
          },
        },
        'light-ray-2': {
          '0%, 100%': {
            opacity: '0.1',
            transform: 'translateX(15px) rotate(-12deg)',
          },
          '50%': {
            opacity: '0.2',
            transform: 'translateX(-15px) rotate(-12deg)',
          },
        },
        'horizon-glow': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.2',
            transform: 'scale(1.1)',
          },
        },
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
      },
    }
  },
  plugins: []
};

