import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss()],
  // GitHub Pages serves this repo at /HabixLabs/, so only that build needs a
  // base path. Every other build (Vercel/habixlabs.site, local dev, etc.)
  // serves from the domain root.
  base: command === "build" && process.env.GITHUB_ACTIONS ? "/HabixLabs/" : "/",
  build: {
    target: "es2020",
  },
}));
