# Use OpenJDK 21 slim as base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy JAR file from build/libs
COPY build/libs/UtilityHub-0.0.1-SNAPSHOT.jar app.jar

# Render sets PORT env variable automatically (default 10000)
ENV PORT=10000

# Expose the same port
EXPOSE 10000

# Run Spring Boot app binding to Render's port
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}", "--server.address=0.0.0.0"]
