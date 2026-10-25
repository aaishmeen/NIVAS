FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app
COPY . .

RUN mkdir -p bin && find src -name "*.java" > sources.txt && javac -cp "bin:lib/*" -d bin @sources.txt

EXPOSE 8085
CMD ["java", "-cp", "bin:lib/*", "server.NivasHttpServer"]
