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

## Environment Setup

```bash
cdk bootstrap aws://ACCOUNT-ID/REGION --profile PROFILE-NAME
```

### Context

- In ./cdk.json, the context object is used to set environment properties.
  - These properties can be added in `./cdk.context.json` instead.

```json
{
  "context": {
    "selected-env": "-",
    "test-env": {
      "resource-prefix": "test"
    },
    "prod-env": {
      "resource-prefix": "prod"
    }
  }
}
```

- Context values can be retrieved within the dck scripts with `node.tryGetContext('test-evn');`.
- Environment swapping can be easily done through the use of context and cli flags.
  - Create a property which defines the selected environment (e.g.: `selected-env`).
  - Create parameter objects within context under the environment name (e.g.: `test-env`, `prod-env`, etc).
  - When running cdk synth, define the environment with `cdk synth --context PROPERTY=VALUE` (e.g.: `cdk synth --context   "selected-env"="test-env"`).
