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
        // Brand Palette - Following 60-30-10 Rule
        // 60% - Dominant Color (White/Background)
        background: {
          light: "#D6D6D6", // Light theme background
          dark: "#202020", // Dark theme background
        },
        // 30% - Secondary Color (Black/Text & UI)
        foreground: {
          light: "#202020", // Light theme text
          dark: "#D6D6D6", // Dark theme text
          muted: "#333533", // Muted foreground for borders
        },
        // 10% - Accent Colors (Yellow/Pop)
        accent: {
          primary: "#FFEE32", // Vibrant yellow
          secondary: "#FFD100", // Golden yellow
          muted: "#333533", // Dark gray for contrast
        },
        // Semantic colors for consistency
        brand: {
          50: "#D6D6D6", // Light background
          100: "#FFEE32", // Primary accent
          200: "#FFD100", // Secondary accent
          300: "#202020", // Dark text/UI
          400: "#333533", // Muted dark
        },
        // Functional colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        // Familjen Grotesk as primary font
        sans: [
          "Familjen Grotesk",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // Monospace fallback
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "pulse-subtle": "pulseSubtle 2s infinite",
        "glow-accent": "glowAccent 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        glowAccent: {
          "0%, 100%": {
            boxShadow: "0 0 5px #FFEE32, 0 0 10px #FFEE32, 0 0 15px #FFEE32",
          },
          "50%": {
            boxShadow: "0 0 10px #FFEE32, 0 0 20px #FFEE32, 0 0 30px #FFEE32",
          },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(32, 32, 32, 0.07), 0 10px 20px -2px rgba(32, 32, 32, 0.04)",
        medium:
          "0 4px 25px -5px rgba(32, 32, 32, 0.1), 0 10px 10px -5px rgba(32, 32, 32, 0.04)",
        large:
          "0 10px 40px -10px rgba(32, 32, 32, 0.15), 0 2px 10px -2px rgba(32, 32, 32, 0.05)",
        xl: "0 20px 25px -5px rgba(32, 32, 32, 0.1), 0 10px 10px -5px rgba(32, 32, 32, 0.04)",
        "2xl": "0 25px 50px -12px rgba(32, 32, 32, 0.25)",
        accent: "0 0 20px rgba(255, 238, 50, 0.3)",
        "accent-glow": "0 0 30px rgba(255, 238, 50, 0.5)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #FFEE32 0%, #FFD100 100%)",
        "gradient-brand-reverse":
          "linear-gradient(135deg, #FFD100 0%, #FFEE32 100%)",
        "gradient-light":
          "linear-gradient(135deg, #D6D6D6 0%, #FFFFFF 50%, #D6D6D6 100%)",
        "gradient-dark":
          "linear-gradient(135deg, #202020 0%, #333533 50%, #202020 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #FFEE32 0%, #FFD100 50%, #FFEE32 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      // Custom utilities for the 60-30-10 rule
      backgroundColor: {
        "brand-60": "#D6D6D6",
        "brand-30": "#202020",
        "brand-10": "#FFEE32",
      },
      textColor: {
        "brand-60": "#D6D6D6",
        "brand-30": "#202020",
        "brand-10": "#FFEE32",
      },
      borderColor: {
        "brand-60": "#D6D6D6",
        "brand-30": "#202020",
        "brand-10": "#FFEE32",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
