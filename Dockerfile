# Build: Vite client -> dist/public, esbuild server -> dist/index.cjs
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads
EXPOSE 5000
ENV PORT=5000
CMD ["node", "dist/index.cjs"]
