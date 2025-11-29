# PAKAI DEBIAN, BUKAN ALPINE
FROM node:20 AS base

# ---------- DEPS STAGE ----------
FROM base AS deps
WORKDIR /app

# (Debian image sudah pakai glibc & punya openssl/libssl yang Prisma butuh)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# ---------- BUILD STAGE ----------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Bikin user non-root
RUN useradd -m nextjs
USER nextjs

# Copy node_modules (biar npx prisma pakai prisma 5.21.1 lokal)
COPY --from=builder /app/node_modules ./node_modules

# Copy public & build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Migrasi DB dulu, baru jalanin server
CMD ["sh", "-c", "npx prisma db push && node server.js"]