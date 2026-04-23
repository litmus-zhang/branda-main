FROM oven/bun:latest AS base

WORKDIR /app

# copy lockfile first for cache
COPY  package.json ./
RUN bun install --production

# copy the rest of the source, including routes
COPY . .

# make sure the folder exists (in case it’s empty)
RUN mkdir -p src/routes

# expose default port
EXPOSE 3000
# EXPOSE 9080

# ---- Run ---------------------------------------------------------
# CMD ["bun", "run", "src/index.ts"]
ENTRYPOINT [ "bun", "start" ]