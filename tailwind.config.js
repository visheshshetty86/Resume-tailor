/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 60px rgba(56, 189, 248, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(14, 165, 233, 0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.18), transparent 28%)",
      },
    },
  },
  plugins: [],
};
