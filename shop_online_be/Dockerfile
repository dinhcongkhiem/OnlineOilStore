FROM openjdk:17-slim AS builder

WORKDIR /app
COPY . .
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean install -DskipTests

# Build ứng dụng Spring Boot
FROM openjdk:17-slim

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Cấp quyền thực thi cho tệp JAR
RUN chmod +x app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]