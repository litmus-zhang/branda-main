FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps
# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

