# ---- Build stage ----
FROM openjdk:21-jdk-slim AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean build -x test --no-daemon

# ---- Run stage ----
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/UtilityHub-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
