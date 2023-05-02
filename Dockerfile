# Use the official Node.js Alpine image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /api

# Install required dependencies
RUN apk add --no-cache --virtual .gyp python3 make g++

# Copy package.json and package-lock.json from the /api directory into the working directory
COPY api/package.json api/package-lock.json ./

# Install the dependencies using npm
RUN npm ci

# Copy the rest of the application code from the /api directory into the working directory
COPY api .

# Expose the port your application will run on
EXPOSE 1534

# Run the application using npm
CMD ["npm", "run", "start"]
