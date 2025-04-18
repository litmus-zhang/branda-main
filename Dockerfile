# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first so cached layers can be reused
COPY package*.json ./
# Install production dependencies only
RUN npm install --legacy-peer-deps --production

# Copy source files and build if needed
COPY . .

# Stage 2: Production Image
FROM node:20-alpine

WORKDIR /app
# Copy only the production build/artifacts
COPY --from=builder /app /app

EXPOSE 3000
CMD [ "yarn", "start:prod" ]