# AWS-CDK

- [Getting started](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

```cmd
npm install -g aws-cdk
```

- To start a project, either create a manual setup or use of of the templates available in cdk.
  - templates:
    - app: cdk application
    - lib: cdk construct library
    - sample-app: cdk application with constructs
  - A project can be written in different languages, defined with `-l`.
    - csharp
    - fsharp
    - go
    - java
    - javascript
    - typescript

```bash
cdk init app -l javascript
```

```bash
cdk bootstrap aws://ACCOUNT-ID/REGION --profile PROFILE-NAME
```
