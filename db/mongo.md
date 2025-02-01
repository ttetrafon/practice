# MongoDB

## Backup & Restore Data

```cmd
docker exec -it mongodb_container mongodump --uri="mongodb://admin:password@localhost:27017" --out=/backup
docker cp mongodb_container:/backup ./mongodb_backup

docker cp ./mongodb_backup new_mongodb_container:/backup
docker exec -it new_mongodb_container mongorestore --uri="mongodb://admin:password@localhost:27017" /backup
```

```cmd
docker exec -it mongodb_container mongoexport --uri="mongodb://admin:password@localhost:27017" -d my_database -c my_collection --out /backup/my_collection.json
docker cp mongodb_container:/backup/my_collection.json ./my_collection.json

docker cp ./my_collection.json new_mongodb_container:/backup/my_collection.json
docker exec -it new_mongodb_container mongoimport --uri="mongodb://admin:password@localhost:27017" -d my_database -c my_collection --file /backup/my_collection.json --jsonArray
```
