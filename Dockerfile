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
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN useradd -m nextjs

# copy dengan owner nextjs
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

# pilih salah satu:
# CMD ["sh","-c","npx prisma migrate deploy --skip-generate && node server.js"]
CMD ["sh","-c","npx prisma db push --skip-generate && node server.js"]