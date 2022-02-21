# Build the client files in a build stage
FROM node:lts-alpine as build
RUN apk add --no-cache git

WORKDIR /app

# Install npm dependencies
COPY patches /app/patches/
COPY package*.json .npmrc /app/
RUN npm ci

# Build the Angular project
COPY . /app
RUN npm run docker-build

FROM nginx:alpine

# Copy in nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy in the built Angular app from the build stage
COPY --from=build /app/dist/hydrus-web /usr/share/nginx/html
