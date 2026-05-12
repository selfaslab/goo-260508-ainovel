import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { devApiMiddleware } from "./vite/devApiMiddleware";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    plugins: [
      {
        name: "dev-local-api",
        apply: "serve",
        configureServer(server) {
          server.middlewares.use(devApiMiddleware());
        },
      },
      react(),
    ],
    server: {
      port: 5173,
    },
  };
});
