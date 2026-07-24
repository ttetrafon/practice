# Local AI

- Useful Links:
  - Continue extension:
    - [Model Setup](https://docs.continue.dev/ide-extensions/agent/model-setup)
    - [Model Capabilities](https://docs.continue.dev/customize/deep-dives/model-capabilities)

## Preparation

- Install [Ollama](https://ollama.com/)
  - [Docs](https://docs.ollama.com/cli)
- Download models:
  - `ollama pull nomic-embed-text`: for indexing codebases
  - [MSI]
    - `ollama pull qwen2.5-coder:7b`: for quick tasks & autocomplete
    - `deepseek-r1:14b`: for chat mode
- Install the `continue` plugin in VSCode and JetBrains.
  - Configure Continue (`config.yaml`; [reference](docs.continue.dev/reference)):

```yaml
name: Local Config
version: 1.0.0
schema: v1
models:
- name: Qwen 3 (8B) - Best for Agents
  provider: ollama
  model: qwen3:8b
  roles:
  - chat
  - edit
  - apply
  capabilities:
  - tool_use
  - image_input
  defaultCompletionOptions:
    contextLength: 32768
    temperature: 0.0
    keepAlive: 300
  requestOptions:
    extraBodyProperties:
      num_gpu: 99
- name: Nomic Embed
  provider: ollama
  model: nomic-embed-text:latest
  roles:
  - embed
```

## Usage

- Index the codebase.
- Create a folder `.continue/rules` in each project to define rules for the language model. The agent reads this every time it works.
  - For example, `architecture.md` could include an overview of the project.
