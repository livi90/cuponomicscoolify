# Etapa base
FROM node:20-alpine AS base

# Instala dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Etapa de dependencias
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# Etapa de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Actualiza npm a la última versión estable
RUN npm install -g npm@latest

# Configurar variables de entorno para el build
# Coolify puede pasar estas como build args o como environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG SERPAPI_KEY
ARG NEXT_PUBLIC_MEILISEARCH_URL
ARG SERVICE_PASSWORD_MEILISEARCH
ARG GOOGLE_VERIFICATION
ARG YANDEX_VERIFICATION
ARG YAHOO_VERIFICATION

# Establecer variables de entorno con fallbacks
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-http://localhost:54321}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3000}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}
ENV SERPAPI_KEY=${SERPAPI_KEY}
ENV NEXT_PUBLIC_MEILISEARCH_URL=${NEXT_PUBLIC_MEILISEARCH_URL:-https://meilisearch-b8osgk4ckgococo40080w80w.dbcuponomics.online}
ENV SERVICE_PASSWORD_MEILISEARCH=${SERVICE_PASSWORD_MEILISEARCH}
ENV GOOGLE_VERIFICATION=${GOOGLE_VERIFICATION}
ENV YANDEX_VERIFICATION=${YANDEX_VERIFICATION}
ENV YAHOO_VERIFICATION=${YAHOO_VERIFICATION}
ENV NODE_ENV=production

# Debug: mostrar las variables de entorno (solo para debug)
RUN echo "Build variables:" && \
    echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL" && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..." && \
    echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL" && \
    echo "NEXT_PUBLIC_SITE_URL: $NEXT_PUBLIC_SITE_URL"

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"] 