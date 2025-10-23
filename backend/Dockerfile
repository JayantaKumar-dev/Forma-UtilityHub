FROM openjdk:21-jdk-slim
WORKDIR /app
COPY backend/build/libs/UtilityHub-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
