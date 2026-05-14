# Local AI

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
- name: Deepseek R1 14B
  provider: ollama
  model: deepseek-r1:14b
  roles:
  - chat
  - edit
  - apply
  capabilities:
  - tool_use
  - image_input
  defaultCompletionOptions:
    contextLength: 16384
    temperature: 0.7
    keepAlive: 600
- name: Qwen2.5-Coder 7B
  provider: ollama
  model: qwen2.5-coder:7b
  roles:
  - autocomplete
  defaultCompletionOptions:
    contextLength: 4096
    keepAlive: 3600
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
