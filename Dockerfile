# Stage 1: Build the client
FROM node:20.11.0 as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Build the server
FROM node:20.11.0 as server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .
# Assuming your server serves the static files from the client
COPY --from=client-build /app/client/build /app/server/public
EXPOSE 3000
CMD ["npm", "start"]
