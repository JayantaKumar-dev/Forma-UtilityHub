# ---- Build Stage ----
FROM gradle:8.10.0-jdk21 AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN gradle clean build -x test --no-daemon

# ---- Run Stage ----
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
