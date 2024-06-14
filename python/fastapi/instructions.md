# FastAPI

- Resources:
  - [FastAPI](https://fastapi.tiangolo.com/)

- To install fastapi, we need the `fastapi` (the framework) and `uvicorn` (the server) modules.

```bash
pip install fastapi
pip install uvicorn
```

- Dev run fastapi with `fastapi dev ./app/main.py`.

- Fast API creates swagger and redoc documentation automatically. They can be accessed at `/docs` and `/redoc` respectively.

## Docker Container

```bash
docker build -t fastapi .
docker run -d --name fastapicontainer -p 80:80 fastapi
```
