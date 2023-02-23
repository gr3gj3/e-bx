# Get the base image of node 19
FROM node:19

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:focal

# Set the environment path to node_modules/.bin
WORKDIR /app

# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin/$PATH

# Copy the needed files to the app folder in Docker image
COPY package.json /app/
COPY tests/ /app/tests/
# COPY . /app/

# Get the needed libraries to run Playwright
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

# Install the dependencies in the Node Environment
RUN npm install