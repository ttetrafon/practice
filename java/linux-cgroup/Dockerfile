# Dockerfile for Cgroup Test Application

# Use a base image with a recent OpenJDK version (e.g., OpenJDK 17 or 21)
# This is similar to what Keycloak would use.
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled Java application into the container
# First, we need to compile it. We'll assume CgroupTest.java is in the same directory.
# For a real build, you'd typically compile it outside or in a multi-stage build.
# For simplicity, we'll compile it inside the container for this test.

# Copy the Java source file
COPY CgroupTest.java .

# Compile the Java source file
RUN javac CgroupTest.java

# Command to run the Java application when the container starts
CMD ["java", "CgroupTest"]

# Optional: Expose a port if your app were a server, not needed for this simple test
# EXPOSE 8080
