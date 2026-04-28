import express, { type Express } from "express";
import fs from "fs";
import path from "path";

function resolvePublicDir(): string {
  // Vercel: static assets live in repo-root `public/` (see vercel-build); Express must match.
  if (process.env.VERCEL) {
    return path.join(process.cwd(), "public");
  }
  // Local / Render: esbuild bundle is dist/index.cjs → __dirname is dist/
  return path.resolve(__dirname, "public");
}

export function serveStatic(app: Express) {
  const distPath = resolvePublicDir();
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
