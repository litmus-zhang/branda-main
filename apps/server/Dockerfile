# Use the official Bun image for a fast, slim runtime
FROM oven/bun:1.1-slim AS base
WORKDIR /app

# ---- Dependencies Stage ----
# We copy the lockfile and package.json to install dependencies first (caching)
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
# We use --production to keep the image small
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ---- Release Stage ----
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Set production environment
ENV NODE_ENV=production

# The 'bun start' command handles migrations and starts the server
# (as defined in your package.json)
ENTRYPOINT [ "bun", "start" ]

EXPOSE 3000