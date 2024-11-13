module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Ensure this is set to 'class'
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4F46E5",        // Primary button color
        "primary-dark": "#4338CA", // Primary button hover color
        red: {
          500: "#EF4444",          // Danger color
          600: "#DC2626",          // Danger hover color
        },
      },
    },
  },
  plugins: [],
};
