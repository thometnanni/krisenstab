# -------------------------------------------------
# 1. Build stage  - install deps, fetch Are.na content, generate dist/
# -------------------------------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# ARENA_TOKEN is provided as a build secret so it never ends up in an image layer
RUN --mount=type=secret,id=arena_token \
    ARENA_TOKEN="$(cat /run/secrets/arena_token)" node index.js

# -------------------------------------------------
# 2. Runtime stage  - static files served by nginx
# -------------------------------------------------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# The app runs on http://localhost:4800
EXPOSE 4800
