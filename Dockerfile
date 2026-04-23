# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install ALL dependencies (including devDependencies like TypeScript)
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build both frontend and backend
RUN npm run build

# Optional: Clean dev dependencies after build to keep the image small
# RUN npm prune --production

# Expose port 3000 to allow communication to/from the application
EXPOSE 3000

# Use the start script we configured in package.json
CMD ["npm", "start"]