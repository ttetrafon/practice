from tkinter import filedialog as fd

path: str = fd.askopenfilename(
                                title="Select a file!",
                                initialdir="./",
                                filetypes=(
                                    ('pdf', '*.pdf'),
                                    ('mp3', '*.mp3'),
                                    ('python', '*.py')
                                )
                            )
print(path)
