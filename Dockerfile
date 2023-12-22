# Use Node 18 alpine as parent image
FROM node:18.16.0-alpine3.17

# Change the working directory on the Docker image to /app
RUN mkdir -p /opt/app 
WORKDIR /opt/app

COPY server/ server/
COPY app/ app/
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install
RUN yarn build

# Expose application port
EXPOSE 3000

# Start the application
CMD yarn start
