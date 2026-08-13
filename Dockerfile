# Stage 1: Build (install all deps + compile frontend + bundle server)
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install ALL deps (including devDeps needed for build)
RUN npm ci

# Copy entire source
COPY . .

# Build Vite frontend + esbuild server bundle
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Production image (runtime only — no dev tooling, no src files)
FROM node:24-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy assets folder (PDF worker assets etc.)
COPY --from=builder /app/assets ./assets

# Set NODE_ENV
ENV NODE_ENV=production
ENV PORT=3000

# Expose HTTP port
EXPOSE 3000

# Healthcheck — hits /api/health every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Run the compiled server bundle
CMD ["node", "dist/server.cjs"]
