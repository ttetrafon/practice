# Networking

## Types of Communication

- Polling
  - Synchronous periodic requests regardless of having actual data to transmit.
  - Requests are sent by the client to the server in a specified time interval.
  - The response from the server holds data or a warning message.
- Long Polling
  - A better Polling type communication.
- Streaming
  - A connection between client and server stays open indefinitely.
- AJAX
  - Based on Javascript's XmlHttpRequest Object. It is an asynchronous mode of communication, allowing only parts of the webpage to be processed.
- Websockets
  - Always active, two-way communication (over TCP) between server and client.
- SFTP
  - Secure connection through ssh and keys exchange.
  - In `hosts`, the target IP should be added, alongside the target host's identity.
  - To obtain the fingerprint, connect through ssh from the console (ssh foo@sftp.optpg.com), which will produce the required identity key in the system's host file after a prompt.
