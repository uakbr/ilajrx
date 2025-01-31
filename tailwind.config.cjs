/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6",     // Example: light blue
          DEFAULT: "#2563eb",   // Example: primary blue (used for default backgrounds)
          dark: "#1d4ed8",      // Example: dark blue for hover/active states
        },
        secondary: {
          light: "#f87171",     // Light red for warnings
          DEFAULT: "#ef4444",   // Main error/danger color
          dark: "#dc2626",      // Dark red variant
        },
        success: "#10b981",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] // Extended default sans-serif stack
      },
    },
  },
  plugins: [],
}
