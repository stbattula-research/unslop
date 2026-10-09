# unslop-mcp

An [MCP](https://modelcontextprotocol.io) server for the Unslop component library — so an agent calls **tools** instead of reading `registry.json` plus a dozen component files.

Why: an agent consuming Unslop today reads `registry.json`, the `r/*.json` bundles, and the component sources — token-heavy before any work starts. Three tool calls replace all of that.

## Tools

| Tool | What it does |
|---|---|
| `search_components(query, top?)` | Natural-language request → ranked matches with scores, descriptions, install hints. Same intent scoring as `./unslop find`. |
| `get_component(id, stack?)` | Full source of one component (`react` or `html` stack) — file paths + contents inline. |
| `install_component(id, stack, target_dir)` | Writes the component's files into a project dir. React: the shadcn bundle paths; HTML: the `.html`/`.css` pair. |

`search_components("pricing section for a coffee brand")` returns `pricing` (Menu Pricing) first; `get_component("pricing", "react")` returns the shadcn bundle with `Button.tsx`-style sources inline.

## Quick start

```bash
cd servers/unslop-mcp
npm install
npm start      # stdio server; point your client at this command
npm test       # runs the stdio integration tests (node:test, stdlib only)
```

The server resolves the Unslop checkout relative to its own location (`servers/unslop-mcp` → repo root), so run it from anywhere as long as the checkout is intact.

## Add to Claude Code

```bash
claude mcp add unslop -- node /path/to/unslop/servers/unslop-mcp/src/server.js
```

(needs `npm install` run once in `servers/unslop-mcp/` first)

## Add to Claude Desktop

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "unslop": {
      "command": "node",
      "args": ["/path/to/unslop/servers/unslop-mcp/src/server.js"],
      "env": {}
    }
  }
}
```

## Notes

- Scoring is a direct port of the `./unslop find` router in the repo root, so MCP results rank identically to the CLI.
- `install_component` refuses paths that escape `target_dir` and only accepts real registry names.
- Requirements: Node ≥ 18, plus `npm install` once for `@modelcontextprotocol/sdk`.
