# (1) Create: python -m venv env
#     !`env` is just a name, it can be anything.
# (2) Activate: env/Scripts/Activate.ps1
# (3) Install modules as if globally `pip install <module_name>`
  # (i) Always install 'wheel' in a new environment (`pip install wheel`) first.
# (4) ... work
# (5) Deactivate: deactivate

# For git:
# (1) Add the environment folder in .gitignore
# (2) Deactivate the environment (if active)
# (3) Run `pip freeze > requirements.txt` to store any installed packages.
# (4) Commit this file with the repository.
# (5)