/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        journey: {
          ink: "#0f172a",
          muted: "#64748b",
          line: "#cbd5e1",
          accent: "#0d9488",
          accentSoft: "#ccfbf1",
          warm: "#ea580c",
          surface: "#f8fafc",
          card: "#ffffff",
        },
      },
      backgroundImage: {
        "grid-subtle":
          "linear-gradient(to right, rgb(148 163 184 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};
