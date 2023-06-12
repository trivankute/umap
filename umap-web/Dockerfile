# Build BASE
FROM node:16-alpine as BASE
LABEL author="umap"

WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    #&& yarn --frozen-lockfile
    && npm ci
RUN npm cache clean --force

# Build Image
FROM node:16-alpine AS BUILD
LABEL author="umap"


WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .

RUN apk add --no-cache curl \ 
  && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin 
#RUN apk del curl

RUN apk add --no-cache git curl \
    && npm run build \
    && cd .next/standalone \
    && node-prune

# Build production
FROM node:16-alpine AS PRODUCTION
LABEL author="umap"

WORKDIR /app

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]