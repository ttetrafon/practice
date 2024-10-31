FROM bitnami/kafka:latest
USER root
RUN mkdir -p /opt/kafka/connectors && \
    mkdir -p /etc/kafka && \
    curl -SL "https://repo1.maven.org/maven2/org/apache/kafka/kafka-mirror-maker/3.8.1/kafka-mirror-maker-3.8.1.jar" -o /opt/kafka/connectors/kafka-mirror-maker.jar
COPY mirror-maker.properties /etc/kafka/mirror-maker.properties
RUN mkdir -p /tmp
ENV KAFKA_CONNECT_PLUGIN_PATH=/opt/kafka/connectors
