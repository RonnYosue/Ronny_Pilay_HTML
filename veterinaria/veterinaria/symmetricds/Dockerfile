FROM openjdk:17-jdk-slim

WORKDIR /opt

COPY symmetric-server /opt/symmetricds
WORKDIR /opt/symmetricds

RUN chmod +x ./bin/sym

## Ejecuttar los engines en modo multi engine, esto detecta los engines que se encuentran en la carpeta engines
CMD ["./bin/sym"]