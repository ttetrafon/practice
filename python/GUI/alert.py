import tkinter as tk

root = tk.Tk()
im = tk.PhotoImage(file="Chat.png")

image = tk.Label(root, image=im)
image.pack(side="left")

message = tk.Label(root, text="This system will terminate soon. Please save your work to avoid losing anything.")
message.pack()

root.mainloop()
