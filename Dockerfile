# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install --only=production

# Create server directory and copy server files
RUN mkdir -p server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --only=production

# Copy source code
WORKDIR /app
COPY . .

# Move server files to correct location
RUN cp -r server/* /app/
RUN rm -rf server

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://yield-spirit.paymebro.xyz/api/health || exit 1

# Start the application
CMD ["node", "server.js"]