# Use an official Node.js runtime as a parent image for building
FROM node:18.17.0-alpine AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm ci for a clean, predictable install)
RUN npm ci --no-audit --no-fund

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Stage for running tests
FROM build AS test

# Install Jest and ts-jest
RUN npm install --save-dev jest ts-jest @types/jest

# Run tests
RUN npm test

# Final stage: use a distroless Node.js image
FROM gcr.io/distroless/nodejs18-debian11:nonroot AS production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# Use a non-root user
USER nonroot

# Expose the port (use a default if not provided)
ARG PORT=4000
ENV PORT=${PORT}

# Expose the port the app runs on
EXPOSE ${PORT}

# Set Node.js to run in production mode
ENV NODE_ENV production

# Define the command to run the application
CMD ["dist/server.js"]
