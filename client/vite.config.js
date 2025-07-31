import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "crypto";

// Monkey-patch global crypto for Vite compatibility
globalThis.crypto ??= {};
globalThis.crypto.subtle ??= {
  digest: async (algo, data) => {
    const hash = createHash(algo.toLowerCase().replace("-", ""));
    hash.update(Buffer.from(data));
    return hash.digest();
  }
};

export default defineConfig({
  plugins: [react()],
});
