# Build the client files in a build stage
FROM node:alpine as build
RUN apk add --no-cache git

WORKDIR /app

# Install npm dependencies
COPY package*.json /app/
RUN npm ci

# Build the Angular project
COPY . /app
RUN npm run docker-build

FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy in nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy in the built Angular app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
