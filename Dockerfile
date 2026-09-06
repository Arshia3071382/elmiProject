##########################
# 1. Base image
##########################
# Next.js 16 requires Node >= 20.9. Using 22 (current LTS).
FROM node:22-alpine AS base
# libc6-compat is recommended by Next.js docs for Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Enable corepack so the pnpm version pinned in pnpm-lock.yaml is used
RUN corepack enable

##########################
# 2. Install dependencies
##########################
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

##########################
# 3. Build the app
##########################
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public envs must be present at build time because Next.js
# inlines NEXT_PUBLIC_* values into the client bundle.
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

##########################
# 4. Production runtime
##########################
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Only what "output: standalone" traces as actually needed at runtime
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]