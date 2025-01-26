import path from "path";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../.env") });

// https://vite.dev/config/
export default defineConfig({
    plugins: [wasm(), topLevelAwait(), react()],
    optimizeDeps: {
        exclude: ["onnxruntime-node", "@anush008/tokenizers"],
    },
    build: {
        commonjsOptions: {
            exclude: ["onnxruntime-node", "@anush008/tokenizers"],
        },
        rollupOptions: {
            external: ["onnxruntime-node", "@anush008/tokenizers"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,
        proxy: {
            "/api": {
                target: `http://127.0.0.1:${process.env.SERVER_PORT || 3000}`,
                // target: `https://8f3031d4d475aca882625b335e34ba8b57b250bd-3000.dstack-prod4.phala.network`,
                // target: `https://3000-xnomadai-core-0nekbiexrmi.ws-us117.gitpod.io`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
