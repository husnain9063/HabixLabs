import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss()],
  base: command === "build" ? "/HabixLabs/" : "/",
  build: {
    target: "es2020",
  },
}));
