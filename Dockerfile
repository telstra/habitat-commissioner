# FROM node:8.7.0
FROM node:10.15.3-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
# COPY package-lock.json /app
RUN npm config set proxy
# RUN npm config set https-proxy
RUN npm config set https-proxy 'https://localhost:8081'
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 8080
CMD [ "npm", "start" ]
