import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "globalThis.__MYSKILL_API_URL__": JSON.stringify(
        env.VITE_API_URL || "http://localhost:4000/api"
      ),
      "globalThis.__MYSKILL_GA_ID__": JSON.stringify(env.VITE_GA_ID || ""),
    },
    server: {
      port: 5173,
    },
  };
});
