import socket
import threading

PORT = 5050
SERVER = socket.gethostbyname(socket.gethostname()) # "192.168.1.102"
ADDR = (SERVER, PORT)
HEADER = 64
FORMAT = 'utf-8'
DISCONNECT = "!!!DISCONNECT!!!"

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)

def handle_client(conn, addr):
    print(f"[CLIENT CONNECTED] {addr} connected.")
    connected = True
    while connected:
        msg_length = conn.recv(HEADER).decode(FORMAT)
        if msg_length:
            msg_length = int(msg_length)
            msg = conn.recv(msg_length).decode(FORMAT)
            if (msg == DISCONNECT):
                connected = False
            print(f"[{addr}] {msg}")
            conn.send("Message received!".encode(FORMAT))
    conn.close()

def count_active_connections():
    print(f"[ACTIVE CONNECTIONS] {threading.activeCount() - 1}")

def start():
    server.listen()
    print(f"[LISTENING] server is listening on {SERVER}:{PORT}")
    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
        count_active_connections()

print("[STARTING] server is starting")
start()