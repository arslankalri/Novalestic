// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Public (publishable) backend settings. .env is git-ignored in this repo, so published
// builds would otherwise ship without them. These values are safe to expose in browser code.
const PUBLIC_BACKEND = {
  url: process.env.VITE_SUPABASE_URL || "https://muxzirapjvzifhunkwfw.supabase.co",
  key: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_sXZZPR4CzoqbqMqCdqpf1g_6cCkDias",
  projectId: process.env.VITE_SUPABASE_PROJECT_ID || "muxzirapjvzifhunkwfw",
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(PUBLIC_BACKEND.url),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(PUBLIC_BACKEND.key),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(PUBLIC_BACKEND.projectId),
    },
  },
});
