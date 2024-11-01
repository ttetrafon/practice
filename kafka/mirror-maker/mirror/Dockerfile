FROM bitnami/kafka:latest
USER root
COPY mirror-maker.properties /etc/kafka/mirror-maker.properties
RUN mkdir -p /tmp
ENV KAFKA_CONNECT_PLUGIN_PATH=/opt/kafka/connectors
