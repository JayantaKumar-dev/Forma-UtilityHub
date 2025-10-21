# Step 1: Use OpenJDK as base image
FROM openjdk:21-jdk-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy Gradle wrapper and build files first (for better caching)
COPY gradlew ./
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Step 4: Give execute permission to gradlew (important!)
RUN chmod +x gradlew

# Step 5: Download dependencies (for caching, optional but efficient)
RUN ./gradlew dependencies --no-daemon || true

# Step 6: Copy the rest of the source code
COPY src src

# Step 7: Build the application
RUN ./gradlew clean build -x test --no-daemon

# Step 8: Expose port for Render
EXPOSE 8080

# Step 9: Run the Spring Boot JAR
CMD ["java", "-jar", "build/libs/UtilityHub-0.0.1-SNAPSHOT.jar"]
