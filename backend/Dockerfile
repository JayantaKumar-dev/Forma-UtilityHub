# Use a lightweight OpenJDK base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR
COPY build/libs/UtilityHub-0.0.1-SNAPSHOT.jar app.jar

# Use Render's injected port dynamically
ENV PORT=10000
EXPOSE 10000

# Run the app binding to the Render-assigned port
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT} --server.address=0.0.0.0"]
