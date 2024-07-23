# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY . .
ARG REACT_APP_SERVER_HOST
ARG REACT_APP_ADDRESS_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_SERVER_HOST}
ENV REACT_APP_API_ADDRESS_URL=${REACT_APP_ADDRESS_URL}
RUN npm run build

# Production stage
FROM nginx:alpine

COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html


