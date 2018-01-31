FROM node:8.7.0

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm config set proxy
RUN npm config set https-proxy
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 8080
CMD [ "npm", "start" ]
