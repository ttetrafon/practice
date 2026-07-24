from fastapi import FastAPI
from app.api.api_v1.api import router as api_router
from mangum import Mangum

app = FastAPI(title="FastAPILambda")

@app.get("/")
async def root():
    return {"message": "FastAPI running!"}

app.include_router(api_router, prefix="/api/v1")
handler = Mangum(app)

# DEPLOYMENT:
# pip install -t dependencies -r requirements.txt --upgrade
# Compress-Archive ./dependencies/* aws_lambda_artifact.zip
# Compress-Archive -update ./app/* aws_lambda_artifact.zip
# aws s3 cp ./aws_lambda_artifact.zip s3://ttetrafon-staging-directory/aws_lambda_artifact.zip --profile ttetrafon --region eu-south-1

# https://stackoverflow.com/questions/76650856/no-module-named-pydantic-core-pydantic-core-in-aws-lambda-though-library-is-i
# https://stackoverflow.com/questions/77875367/aws-lambda-unable-to-import-module-lambda-function-no-module-named-pydanti



# pip install -r requirements.txt --platform manylinux2014_x86_64 --target ./python --only-binary=:all:
# pip install -t dependencies -r requirements.txt --platform manylinux2014_x86_64 --upgrade --only-binary=:all:
