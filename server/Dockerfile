# Use an official Node runtime as a parent image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Make port available outside this container
EXPOSE 5001

# Run nodemon when the container launches
CMD ["nodemon", "server.js"]
