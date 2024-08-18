# Use an official Node.js runtime as a parent image
FROM node:18.17.0-alpine AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm ci for a clean, predictable install)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a minimal runtime image to reduce the final image size
FROM node:18.17.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
ENV NODE_ENV=production
RUN npm ci --only=production

# Expose the port (use a default if not provided)
ARG PORT=4000
ENV PORT=${PORT}

# Expose the port the app runs on
EXPOSE ${PORT}

# Run the application as a non-root user
USER node

# Define the command to run the application
CMD ["node", "dist/server.js"]
