# File System

## Structure

- `\`: root of the filesystem
- `\boot`: kernel & boot records
- `\bin`: shared binaries
  - `\usr\bin`: user specific binaries
- `\root`: the super user folder
- `\usr`: most programs & data
- `\home`: files & folders for each user
- `\media`: root for connected storage devices
- `\mnt`: root for mounted storage devices
- `\tmp`: temporary storage; empties on restart

## Operation

### Searching

- Listing directories/files:

```bash
ls -LRal path_to_directory
```

### Permissions

```bash
chmod xxx path
```
