

# -------- Build stage --------
FROM node:latest AS builder
WORKDIR /app

# Install deps (use lockfile for reproducible builds)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM nginx:latest AS runner

# Clean default web dir and copy built assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for SPA routing and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Use default nginx start command
# CMD ["nginx", "-g", "daemon off;"]