import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Used when mocks are off. Set this to your Express port from the repo's .env
  server: { port: 5173, proxy: { "/api": "http://localhost:4000" } },
});
