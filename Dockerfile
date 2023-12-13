# Use Node 18 alpine as parent image
FROM node:18.16.0-alpine3.17

# Change the working directory on the Docker image to /app
RUN mkdir -p /opt/app 
WORKDIR /opt/app

# Copy package.json and package-lock.json to the /app directory
COPY server/ .

# Install dependencies
RUN yarn install
RUN yarn build

# Expose application port
EXPOSE 4000

# Start the application
CMD yarn start
