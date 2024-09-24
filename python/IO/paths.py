from pathlib import Path
import json

# Get the absolute path of a file/directory.
# Note that .resolve() also supports sym-links and relative paths.
file: str = "./input.json"
print(Path(file).resolve(), "<>", Path(file).absolute())

# Get the current working directory.
print(Path.cwd())

# Path() without any arguments resolves to the current working directory.
for p in Path().iterdir():
  print(p)

# Path() can be used with relative locations too.
for p in Path("../").iterdir():
  print(p)
print(Path("../").resolve())

# Get common info about a specific path.abs
my_dir: Path = Path("test_dir")
print(f"name='{my_dir.name}', stem='{my_dir.stem}', extension='{my_dir.suffix}', exists='{my_dir.exists()}', parent='{my_dir.parent}', is dir/file='{my_dir.is_dir()}/{my_dir.is_file}'")

my_file: Path = Path("./input.json")
print(f"name='{my_file.name}', stem='{my_file.stem}', extension='{my_file.suffix}', exists='{my_file.exists()}', parent='{my_file.parent}', is dir/file='{my_file.is_dir()}/{my_file.is_file}'")

# Get a file inside a directory.abs
my_inner_file: Path = my_dir / "input_inner.json"
print(f"name='{my_inner_file.name}', stem='{my_inner_file.stem}', extension='{my_inner_file.suffix}', exists='{my_inner_file.exists()}, parent='{my_inner_file.parent}', is dir/file='{my_inner_file.is_dir()}/{my_inner_file.is_file}'")

# Get the current script's path.abs
print(f"current script: {Path(__file__).resolve()}")

# Get system folders.
print(f"/home (in linux) or C:/Users/user_name/ (in Windows):")
print("-", Path('~/').expanduser())
print("-", Path.home())

# Search a directory on a pattern:
count: int = 0
pythonDir: Path = Path("..")
for p in pythonDir.resolve().rglob("*.json", case_sensitive=False):
  count += 1
print(f"found {count} .json files in {pythonDir.resolve()}!")

# Open a file:
with my_inner_file.open() as f:
  print(f.read())
# ... or
with open(my_file) as f:
  print(f.read())

# Create/delete/rename directories & files.
temp: Path = Path("TempDirA")
print(f"temp exists? {temp.exists()}")
temp.mkdir(exist_ok=True)
print(f"temp exists? {temp.exists()}")
temp.rmdir() # removes only empty directories
print(f"temp exists? {temp.exists()}")

temp_sub: Path = Path("TempDir/SubDir")
temp_sub.mkdir(exist_ok=True, parents=True)
temp_file: Path = temp_sub / "Temp_File_Initial.txt"
temp_file.touch() # Does not replace the file, but updates its creation time.

new_name: str = temp_file.name.lower()
if Path(temp_sub / new_name).exists:
  temp_file.rename(temp_sub / new_name) # can also use .replace() to overwrite an existing file

if temp_file.exists():
  temp_file.unlink()
