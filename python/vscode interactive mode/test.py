# Create and run cells in the python script.
# Works like a jupiter notebook (Ctrl + Enter: run current cell, Shift + Enter: run current cell and create a new cell).

# %%
import os
import pandas as pd
# %%

os.listdir()
# %%

pd.DataFrame(
    {"one": 1, "two": 2},
    {"one": 11, "two": 22}
)

# %%
