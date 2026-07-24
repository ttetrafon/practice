from tkinter import ttk, font, Tk, StringVar, CENTER
import time
from datetime import datetime

def quit(*args):
    root.destroy()
    return

def clock_time():
    time = datetime.now()
    time = (time.strftime("%H:%M:%S"))
    txt.set(time)
    root.after(333, clock_time)

root = Tk()
root.attributes("-fullscreen", False)
root.configure(background="black")
root.bind("x", quit)
root.after(1000, clock_time)

fnt = font.Font(family="Helvetica", size=50, weight="bold")
txt = StringVar()
lbl = ttk.Label(root, textvariable=txt, font=fnt, foreground="white", background="black")
lbl.place(relx=0.5, rely=0.5, anchor=CENTER)

root.mainloop()
