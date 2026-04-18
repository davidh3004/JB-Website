import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem",
        md: ".375rem",
        sm: ".1875rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)",
        },
        status: {
          online: "rgb(34 197 94)",
          away:   "rgb(245 158 11)",
          busy:   "rgb(239 68 68)",
          offline:"rgb(156 163 175)",
        },
        // Extended indigo scale for premium accents
        indigo: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)"],
        serif:   ["var(--font-serif)"],
        mono:    ["var(--font-mono)"],
        display: ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",  { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg":  ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md":  ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em",  fontWeight: "700" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.2",  letterSpacing: "-0.015em", fontWeight: "600" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)"  },
        },
        "gradient-drift": {
          "0%,100%": { transform: "translate(0%, 0%) scale(1)"     },
          "33%":     { transform: "translate(3%, -4%) scale(1.06)" },
          "66%":     { transform: "translate(-3%, 3%) scale(0.96)" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.6" },
          "50%":     { opacity: "1"   },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)"   },
          "50%":     { transform: "translateY(-12px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)"   },
        },
      },
      animation: {
        "accordion-down":   "accordion-down 0.2s ease-out",
        "accordion-up":     "accordion-up 0.2s ease-out",
        "shimmer":          "shimmer 0.6s ease forwards",
        "gradient-drift":   "gradient-drift 10s ease-in-out infinite",
        "glow-pulse":       "glow-pulse 4s ease-in-out infinite",
        "float":            "float 8s ease-in-out infinite",
        "float-slow":       "float 12s ease-in-out infinite",
        "fade-up":          "fade-up 0.6s ease forwards",
        "count-up":         "count-up 0.5s ease forwards",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #4f46e5, #2563eb, #0891b2)",
        "gradient-hero":   "linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #3b82f6 70%, #06b6d4 100%)",
        "gradient-cta":    "linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #0891b2 100%)",
        "gradient-dark":   "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #164e63 100%)",
      },
      boxShadow: {
        "glow-indigo": "0 0 60px rgba(99,102,241,.25), 0 0 120px rgba(79,70,229,.15)",
        "glow-blue":   "0 0 40px rgba(59,130,246,.20)",
        "card-hover":  "0 20px 60px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
        "card-dark":   "0 20px 60px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
