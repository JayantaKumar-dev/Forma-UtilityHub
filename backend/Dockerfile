# Stage 1: Build the application
FROM gradle:8.7-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Render provides PORT env — use it
ENV PORT=8080
EXPOSE 8080

# Make sure Spring Boot binds to correct port
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]
