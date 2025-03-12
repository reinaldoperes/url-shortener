# Use a Node.js image as the base for the build
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install frontend dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Set the environment variable during the build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the frontend
RUN yarn build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the build files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Default command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
