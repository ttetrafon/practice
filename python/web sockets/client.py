import socket

SERVER = "192.168.1.102"
PORT = 5050
HEADER = 64
FORMAT = 'utf-8'
DISCONNECT = "!!!DISCONNECT!!!"
ADDR = (SERVER, PORT)
ACKNOWLEDGEMENT_LENGTH = len("Message received!".encode())

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(ADDR)

def send(msg):
    message = msg.encode(FORMAT)
    msg_length = len(message)
    send_length = str(msg_length).encode(FORMAT)
    send_length += b' ' * (HEADER - len(send_length))
    client.send(send_length)
    client.send(message)
    print(client.recv(ACKNOWLEDGEMENT_LENGTH).decode(FORMAT))

send("Hello server!!!")
send(DISCONNECT)
