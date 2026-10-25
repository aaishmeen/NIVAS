FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app
COPY . .

RUN mkdir -p bin && javac -cp "bin:lib/*" -d bin src/model/*.java src/service/*.java src/db/*.java src/server/*.java

EXPOSE 8085
CMD ["java", "-cp", "bin:lib/*", "server.NivasHttpServer"]
