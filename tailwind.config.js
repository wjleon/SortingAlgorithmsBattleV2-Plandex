
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        background: "#f3f4f6",
        text: "#1f2937",
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      // Ensure proper spacing on different screen sizes
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Add fallbacks for older browsers
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      // Improve accessibility
      outline: {
        blue: ['2px solid #3b82f6', '1px'],
      },
      // Ensure consistent spacing
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
    },
  },
  plugins: [
    // Add plugin for improved accessibility
    function ({ addBase, theme }) {
      addBase({
        // Improve focus styles for better accessibility
        'a:focus, button:focus, input:focus, select:focus, textarea:focus': {
          outline: `2px solid ${theme('colors.primary')}`,
          outlineOffset: '2px',
        },
        // Ensure proper text contrast
        'body': {
          color: theme('colors.text'),
          lineHeight: '1.5',
        },
        // Improve form element consistency
        'button, input, select, textarea': {
          fontFamily: 'inherit',
        },
      });
    },
  ],
  // Enable JIT mode for better performance
  mode: 'jit',
  safelist: [
    'visualization-bar',
    'visualization-bar-comparing',
    'visualization-bar-swapped',
    'visualization-bar-sorted',
  ],
};
