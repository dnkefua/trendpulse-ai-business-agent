# Container image for the TrendPulse live lead-mining API (server/).
# Built and run by Cloud Run. Cloud Run injects PORT=8080; the server reads
# process.env.PORT, so no port config is needed here.
FROM node:22-slim

WORKDIR /app

# Install only the API's runtime dependencies (not the frontend's) for a lean image.
COPY server/package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund

# Copy the API source (index.js, miners/, lib/).
COPY server/ ./

ENV NODE_ENV=production

CMD ["node", "index.js"]
