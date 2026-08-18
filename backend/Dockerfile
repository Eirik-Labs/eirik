# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci      #installs dependencies from package-lock.json

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["node", "dist/main.js"]







# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only the compiled application from the builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]