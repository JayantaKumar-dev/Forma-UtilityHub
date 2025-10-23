# Use lightweight OpenJDK image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the already-built JAR into the container
COPY build/libs/UtilityHub-0.0.1-SNAPSHOT.jar app.jar

# Render will inject PORT automatically
ENV PORT=8080
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
