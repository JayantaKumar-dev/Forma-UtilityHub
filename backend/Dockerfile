# Step 1: Use OpenJDK as base image
FROM openjdk:21-jdk-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy Gradle files and build project
COPY . .

# Step 4: Build the application
RUN ./gradlew clean build -x test

# Step 5: Run the Spring Boot JAR
CMD ["java", "-jar", "build/libs/UtilityHub-0.0.1-SNAPSHOT.jar"]
