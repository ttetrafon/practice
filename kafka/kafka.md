# KAFKA

- [Documentation](https://kafka.apache.org/documentation/#security_overview)

## Authentication

### SSL

- Create a keystore: `$ keytool -keystore {keystorefile} -alias localhost -validity {validity_in_days} -genkey -keyalg RSA -storetype pkcs12`
- Create a key `$ keytool -keystore server.keystore.jks -alias localhost -validity {validity_in_days} -genkey -keyalg RSA -destkeystoretype pkcs12`
  - Can add the hostname with `-ext SAN=DNS:{FQDN},IP:{IPADDRESS1}` for hostname verification.
- Create a local CA configuration.

```openssl-ca.cnf
HOME            = .
RANDFILE        = $ENV::HOME/.rnd

####################################################################
[ ca ]
default_ca    = CA_default      # The default ca section

[ CA_default ]

base_dir      = .
certificate   = $base_dir/cacert.pem   # The CA certificate
private_key   = $base_dir/cakey.pem    # The CA private key
new_certs_dir = $base_dir              # Location for new certs after signing
database      = $base_dir/index.txt    # Database index file
serial        = $base_dir/serial.txt   # The current serial number

default_days     = 1000         # How long to certify for
default_crl_days = 30           # How long before next CRL
default_md       = sha256       # Use public key default MD
preserve         = no           # Keep passed DN ordering

x509_extensions = ca_extensions # The extensions to add to the cert

email_in_dn     = no            # Don't concat the email in the DN
copy_extensions = copy          # Required to copy SANs from CSR to cert

####################################################################
[ req ]
default_bits       = 4096
default_keyfile    = cakey.pem
distinguished_name = ca_distinguished_name
x509_extensions    = ca_extensions
string_mask        = utf8only

####################################################################
[ ca_distinguished_name ]
countryName         = Country Name (2 letter code)
countryName_default = DE

stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = Test Province

localityName                = Locality Name (eg, city)
localityName_default        = Test Town

organizationName            = Organization Name (eg, company)
organizationName_default    = Test Company

organizationalUnitName         = Organizational Unit (eg, division)
organizationalUnitName_default = Test Unit

commonName         = Common Name (e.g. server FQDN or YOUR name)
commonName_default = Test Name

emailAddress         = Email Address
emailAddress_default = test@test.com

####################################################################
[ ca_extensions ]

subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always, issuer
basicConstraints       = critical, CA:true
keyUsage               = keyCertSign, cRLSign

####################################################################
[ signing_policy ]
countryName            = optional
stateOrProvinceName    = optional
localityName           = optional
organizationName       = optional
organizationalUnitName = optional
commonName             = supplied
emailAddress           = optional

####################################################################
[ signing_req ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
```

- Create a file to store the serial numbers of certificates for the CA: `touch index.txt`
- Create the CA: `$ openssl req -x509 -config openssl-ca.cnf -newkey rsa:4096 -sha256 -nodes -out cacert.pem -outform PEM`
- Add the generated CA to the clients' truststores: `$ keytool -keystore client.truststore.jks -alias CARoot -import -file ca-cert`
- Add the generated CA to the server's (broker) trustore: `$ keytool -keystore server.truststore.jks -alias CARoot -import -file ca-cert`
- Sign the certificate: `$ openssl ca -config openssl-ca.cnf -policy signing_policy -extensions signing_req -out {server certificate} -infiles {certificate signing request}`
- Import the CA certificate in the truststore: `$ keytool -keystore {keystore} -alias CARoot -import -file {CA certificate}`
- Import the signed certificate in the truststore: `$ keytool -keystore {keystore} -alias localhost -import -file cert-signed`
  - **keystore**: the location of the keystore
  - **CA certificate**: the certificate of the CA
  - **certificate signing request**: the csr created with the server key
  - **server certificate**: the file to write the signed certificate of the server to
- *The above processes creates a single truststore that can be shared among all clients and brokers since it does not contain any sensitive information.*

### [SASL/PLAIN](https://kafka.apache.org/documentation/#security_sasl)

#### Broker

- Configure SASL through the environment.

```yaml
KAFKA_LISTENERS: CLIENT://:9093,INTERNAL://:9095,CONTROLLER://:29093
KAFKA_ADVERTISED_LISTENERS: CLIENT://kafka-destination:9093,INTERNAL://kafka-destination:9095
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CLIENT:SASL_PLAINTEXT,INTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
KAFKA_SASL_ENABLED_MECHANISMS: PLAIN
KAFKA_LISTENER_NAME_CLIENT_SASL_ENABLED_MECHANISMS: PLAIN
KAFKA_LISTENER_NAME_CLIENT_PLAIN_SASL_JAAS_CONFIG: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret" user_alice="alice-secret";
```

***OR***

- Create a configuration file in the broker's container.

```kafka_server_jaas.conf
KafkaServer {
  org.apache.kafka.common.security.plain.PlainLoginModule required
  username="admin"
  password="admin-secret"
  user_admin="admin-secret"
  user_alice="alice-secret";
};
```

- Pass the JAAS config file location to the broker: `-Djava.security.auth.login.config=/etc/kafka/kafka_server_jaas.conf`
- Configure the server.properties as needed:

```server.properties
listeners=SASL_SSL://host.name:port
security.inter.broker.protocol=SASL_SSL
sasl.mechanism.inter.broker.protocol=PLAIN
sasl.enabled.mechanisms=PLAIN
```

#### Client

- Configure the JAAS property on the clients: `sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="alice" password="alice-secret";`
- Update the client.properties as needed:

```client.properties
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
```

***OR***

- Create a JAAS config file in the client:

```kafka_client_jaas.conf
KafkaClient {
  com.sun.security.auth.module.Krb5LoginModule required
  useKeyTab=true
  storeKey=true
  keyTab="/etc/security/keytabs/kafka_client.keytab"
  principal="kafka-client-1@EXAMPLE.COM";
};
```

- Pass the JAAS config file location the the client: `-Djava.security.auth.login.config=/etc/kafka/kafka_client_jaas.conf`

## [Authorisation](https://kafka.apache.org/documentation/#security_authz)

- [Confluence docs on ACLs](https://docs.confluent.io/platform/current/security/authorization/acls/overview.html)

## CLI

### Consumers

```bash
./kafka-consumer-groups.sh --bootstrap-server localhost:29092 --all-groups --describe
```

- Reset consumer's offset in topic.

```bash
./kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group GROUP_NAME --topic TOPIC_NAME --reset-offsets --to-earliest --execute
./kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group GROUP_NAME --all-topics --reset-offsets --to-earliest --execute
```

### Topics & Messages

#### Remove Messages in Topic
