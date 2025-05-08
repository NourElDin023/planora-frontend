# Use the official Node.js image as the base image
FROM node:22.14.0-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json and install dependencies
COPY package.json ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["pnpm", "run", "dev"]