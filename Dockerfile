# ============================================================
# MutualCare Insurance System — Dockerfile
# Multi-stage build: keeps final image small (~200MB)
# ============================================================

# ── STAGE 1: Build the Spring Boot JAR ──────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy dependency manifest first (layer caching — faster rebuilds)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy full source and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ── STAGE 2: Slim runtime image ─────────────────────────────
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="MutualCare Team"
LABEL description="MutualCare Insurance System – RSSB Mutuelle de Santé"
LABEL version="1.0.0"

WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /app/target/mutuelle-web-app-1.0.0.jar app.jar

# Expose the Spring Boot default port
EXPOSE 8080

# Health check — Docker will monitor the app automatically
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
