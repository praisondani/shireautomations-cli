# Shire Automations CLI

The `shire` CLI and its MCP mode give agents and people access to Shire Automations' public catalog and workflow planning tools.

## Install

Install the latest GitHub release:

```sh
npm install --global https://github.com/praisondani/shireautomations-cli/releases/latest/download/shireautomations-cli.tgz
shire --help
```

After the npm package is published, you can also use:

```sh
npm install --global shireautomations
```

Or run a command without a global install:

```sh
npx --yes shireautomations tools
```

To run from a source checkout before publication:

```sh
npm install --prefix cli
node cli/bin/shire.js tools
```

## Commands

```sh
shire services
shire pricing
shire tools
shire catalog
shire plan workflow-mapper --input workflow.json
cat workflow.json | shire plan workflow-mapper --input -
```

Planning commands accept JSON and print JSON. The workflow mapper returns an editable SOP draft. Other tools score an automation opportunity, assess AI readiness, plan an integration, build an onboarding checklist, or estimate workload and ROI.

Set `SHIRE_API_URL` to an alternate API origin for development. The default is `https://shireautomations.com`.

## MCP server

The package also runs a local stdio MCP server:

```sh
shire mcp
```

Example client configuration:

```json
{
  "mcpServers": {
    "shireautomations": {
      "command": "shire",
      "args": ["mcp"]
    }
  }
}
```

The server exposes `shire_catalog`, `shire_list_planning_tools`, and `shire_plan`. It calls the same versioned API as the CLI. It does not ask for API credentials, submit intake forms, or start paid work.

## API and privacy

See the [developer resources](https://shireautomations.com/developers), [OpenAPI specification](https://shireautomations.com/openapi.json), or [Postman collection](https://shireautomations.com/postman-collection.json). The API does not save planning requests. Do not send credentials or sensitive customer, patient, or financial-account data. Estimates depend on the input values and are not forecasts or guarantees.
