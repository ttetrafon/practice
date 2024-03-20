# Packages

Manage python packages through `pip`.
```
python -m pip install <package-name>
```

Keep pip updated at all times.
```
python -m pip install --upgrade pip
```

# Virtual Environment

1. Create: python -m venv venv
   1. !`venv` is just a name, it can be anything.
2. Activate: `venv/Scripts/Activate.ps1`
   1. On windows, may need: `Set-ExecutionPolicy Unrestricted -Scope CurrentUser` to run the script.
   2. Use `Process` instead of `CurrentUser` for a limited effect on the above command.
3. Install modules as if globally `pip install <module_name>`
   1. Always install 'wheel' in a new environment (`pip install wheel`) first.
4. ... work
5. Deactivate: deactivate

# For git:
1. Add the environment folder in .gitignore
2. Deactivate the environment (if active)
3. Run `pip freeze > requirements.txt` to store any installed packages.
4. Commit this file with the repository.
5. Others can install the same dependencies by using `pip install -r requirements.txt`.
