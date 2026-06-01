# ── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:24-alpine AS deps

WORKDIR /app

# Copy package files only — leverages Docker layer cache
COPY package.json package-lock.json ./

RUN npm install --ignore-scripts


# ── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Bring in installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Compile TypeScript → dist/
RUN npm run build

# Prune dev dependencies — only production deps go into the final image
RUN npm install --omit=dev --ignore-scripts


# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:24-alpine AS production

# Security: run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Set NODE_ENV so NestJS (and any libraries) behave in production mode
ENV NODE_ENV=production

# Copy only what the app needs to run
COPY --from=builder --chown=appuser:appgroup /app/dist       ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

USER appuser

EXPOSE 3000

# Healthcheck — Docker (and orchestrators like ECS/K8s) will restart the
# container if this fails three times in a row
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]