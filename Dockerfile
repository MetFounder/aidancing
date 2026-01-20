FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY backend/ .

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"]

