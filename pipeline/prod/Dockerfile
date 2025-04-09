# Use the official Bun image as base
FROM oven/bun:latest as builder

# Install p7zip and curl for downloading and extracting the archive
RUN apt-get update && apt-get install -y p7zip-full curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Download and extract the archive in one step to minimize layers
RUN curl -L https://s3.my-domain.com/arch.7z -o arch.7z && \
    7z x arch.7z -y && \
    rm arch.7z

# Use a new stage for the runtime to keep the image size small
FROM oven/bun:1.1.36-slim

# Set working directory
WORKDIR /app

# Copy the extracted application from builder stage
COPY --from=builder /app .

# Expose the port your app runs on
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Start the application
CMD ["bun", "server.js"]