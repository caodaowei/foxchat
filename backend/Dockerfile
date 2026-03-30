FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (使用环境变量 PORT，默认 7001)
EXPOSE 7001

# Start application
CMD ["npm", "start"]
