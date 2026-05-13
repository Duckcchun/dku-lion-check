import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-lion-gray-100",
    "text-lion-gray-400",
    "bg-status-present",
    "bg-status-late",
    "bg-status-late-reason",
    "bg-status-absent",
    "bg-status-absent-excused",
    "text-white",
    "text-lion-black",
  ],
  theme: {
    extend: {
      colors: {
        lion: {
          orange: "#FF7710",
          "orange-light": "#FF9A4D",
          "orange-dark": "#E06000",
          black: "#111111",
          white: "#FFFFFF",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
        status: {
          present: "#FF7710",
          late: "#EAB308",
          "late-reason": "#F97316",
          absent: "#EF4444",
          "absent-excused": "#4B5563",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
}

export default config
