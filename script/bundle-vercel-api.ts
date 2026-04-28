import { build } from "esbuild";
import { rm } from "fs/promises";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const outfile = path.join(root, "api", "index.cjs");

await rm(outfile, { force: true });

await build({
  entryPoints: [path.join(root, "api", "handler.ts")],
  outfile,
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  logLevel: "info",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log(`Bundled Vercel API -> ${outfile}`);
