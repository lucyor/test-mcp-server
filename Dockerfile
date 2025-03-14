# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ts.config.ts ./
COPY src ./src

RUN npm install

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules


# Build the application
RUN npm run build

# Command will be provided by smithery.yaml
CMD ["node", "dist/index.js"]
