/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 20px 50px rgba(2, 6, 23, 0.45)",
      },
      backgroundImage: {
        "hero-radial":
          "linear-gradient(180deg, rgba(15, 23, 42, 0.92) 0%, rgba(2, 6, 23, 1) 70%)",
      },
    },
  },
  plugins: [],
};
