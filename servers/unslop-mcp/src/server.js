#!/usr/bin/env node
/**
 * unslop-mcp — MCP server for the Unslop component library.
 *
 * An agent consumes Unslop today by reading registry.json plus the component
 * files — token-heavy. These tools make the same library token-cheap:
 *
 *   search_components(query)            natural language -> ranked matches
 *   get_component(id, stack?)           full source for one component
 *   install_component(id, stack, dir)   writes the component files into a project
 *
 * stdio transport. Zero config beyond pointing at the repo checkout:
 * the server resolves registry.json and component sources relative to the
 * repository root (three levels up from this file).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Repo layout resolution
// ---------------------------------------------------------------------------

const HERE = path.dirname(fileURLToPath(import.meta.url));
// servers/unslop-mcp/src -> repo root is three levels up
const ROOT = path.resolve(HERE, "..", "..", "..");
const REGISTRY_PATH = path.join(ROOT, "registry.json");
const R_DIR = path.join(ROOT, "r");
const HTML_DIR = path.join(ROOT, "components", "html");

function loadRegistry() {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  return JSON.parse(raw).items;
}

function findItem(id) {
  const items = loadRegistry();
  const hit = items.find((it) => it.name === id);
  if (!hit) {
    const close = items
      .map((it) => it.name)
      .filter((n) => n.includes(id) || id.includes(n));
    const hint = close.length ? ` Did you mean: ${close.join(", ")}?` : "";
    throw new Error(`unknown component '${id}'.${hint}`);
  }
  return hit;
}

// ---------------------------------------------------------------------------
// Scoring — a port of the `unslop` CLI router (Python) so both rank identically
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
  "a,an,the,and,or,of,for,to,in,on,with,i,we,you,need,want,like,make,build,create,add,my,our,that,this,it,is,are,be,as,at,by,from,section,page,site,website".split(
    ","
  )
);

function tokens(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (t) => !STOPWORDS.has(t)
  );
}

function hits(query, phraseList) {
  const qtoks = tokens(query);
  let n = 0;
  for (const phrase of phraseList) {
    const ptoks = tokens(phrase);
    // exact multi-word phrase contained in the query: strong signal
    if (ptoks.length > 1 && query.toLowerCase().includes(phrase.toLowerCase())) {
      n += 2;
    }
    for (const pt of ptoks) {
      for (const qt of qtoks) {
        if (qt === pt || (qt.length > 3 && pt.length > 3 && (qt.includes(pt) || pt.includes(qt)))) {
          n += 1;
          break;
        }
      }
    }
  }
  return n;
}

function score(query, item) {
  const desc = tokens(`${item.title || ""} ${item.description || ""}`).join(" ");
  return (
    3 * hits(query, item.intents || []) +
    2 * hits(query, item.useCases || []) +
    1 * hits(query, [desc]) -
    5 * hits(query, item.notFor || [])
  );
}

function searchComponents(query, top = 3) {
  const items = loadRegistry();
  return items
    .map((item) => ({ item, score: score(query, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
}

// ---------------------------------------------------------------------------
// get_component / install_component
// ---------------------------------------------------------------------------

const RAW_BASE = "https://raw.githubusercontent.com/stbattula-research/unslop/main";

function safeJoin(base, ...parts) {
  const resolved = path.resolve(base, ...parts);
  if (!resolved.startsWith(path.resolve(base) + path.sep)) {
    throw new Error(`refusing to write outside target directory: ${parts.join("/")}`);
  }
  return resolved;
}

function reactBundle(item) {
  const bundle = JSON.parse(
    fs.readFileSync(path.join(R_DIR, `${item.name}.json`), "utf8")
  );
  return bundle;
}

function htmlFiles(name) {
  const out = [];
  for (const ext of ["html", "css"]) {
    const p = path.join(HTML_DIR, name, `${name}.${ext}`);
    if (!fs.existsSync(p)) {
      throw new Error(`missing html source: components/html/${name}/${name}.${ext}`);
    }
    out.push({ path: `${name}.${ext}`, content: fs.readFileSync(p, "utf8") });
  }
  return out;
}

function getComponent(id, stack = "react") {
  const item = findItem(id);
  if (stack === "react") {
    const bundle = reactBundle(item);
    return {
      name: item.name,
      title: item.title,
      description: item.description,
      stack: "react",
      files: bundle.files.map((f) => ({ path: f.path, content: f.content })),
      dependencies: bundle.dependencies || [],
      install_with: `npx shadcn@latest add ${item.url}`,
    };
  }
  if (stack === "html") {
    const files = htmlFiles(item.name);
    return {
      name: item.name,
      title: item.title,
      description: item.description,
      stack: "html",
      files,
      stylesheet_link: `<link rel="stylesheet" href="${item.name}.css">`,
    };
  }
  throw new Error(`unknown stack '${stack}': use 'react' or 'html'`);
}

function installComponent(id, stack = "react", targetDir = ".") {
  const item = findItem(id);
  const dest = path.resolve(targetDir);
  fs.mkdirSync(dest, { recursive: true });
  const written = [];

  if (stack === "react") {
    const bundle = reactBundle(item);
    for (const f of bundle.files) {
      const outPath = safeJoin(dest, f.path);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, f.content, "utf8");
      written.push(path.relative(dest, outPath));
    }
    return {
      name: item.name,
      stack,
      target_dir: dest,
      written,
      next: `npx shadcn@latest add ${item.url}  — or the files above are already in place.`,
    };
  }
  if (stack === "html") {
    for (const f of htmlFiles(item.name)) {
      const outPath = safeJoin(dest, f.path);
      fs.writeFileSync(outPath, f.content, "utf8");
      written.push(path.relative(dest, outPath));
    }
    return {
      name: item.name,
      stack,
      target_dir: dest,
      written,
      next: `Add to your page: <link rel="stylesheet" href="${item.name}.css">`,
    };
  }
  throw new Error(`unknown stack '${stack}': use 'react' or 'html'`);
}

// ---------------------------------------------------------------------------
// MCP server wiring
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "search_components",
    description:
      "Search the Unslop component library with a natural-language request " +
      "(e.g. 'pricing section for a coffee brand'). Returns ranked matches " +
      "with scores, descriptions, and install hints.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What the user is building" },
        top: {
          type: "integer",
          minimum: 1,
          maximum: 10,
          default: 3,
          description: "How many matches to return",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_component",
    description:
      "Fetch the full source of one Unslop component by registry name " +
      "(run search_components first if unsure). Returns file paths and contents.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Component name, e.g. 'pricing', 'hero', 'button'",
        },
        stack: {
          type: "string",
          enum: ["react", "html"],
          default: "react",
          description: "React+Tailwind sources or framework-free HTML/CSS",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "install_component",
    description:
      "Install a component into a project directory: writes its files to " +
      "target_dir (react: the shadcn registry bundle paths; html: the " +
      ".html/.css pair). Creates the directory if needed.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Component name, e.g. 'pricing', 'hero', 'button'",
        },
        stack: {
          type: "string",
          enum: ["react", "html"],
          default: "react",
          description: "Which stack to install",
        },
        target_dir: {
          type: "string",
          description:
            "Directory to install into (resolved against the server's working " +
            "directory when relative)",
        },
      },
      required: ["id", "target_dir"],
    },
  },
];

const server = new Server(
  { name: "unslop-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    let result;
    if (name === "search_components") {
      const matches = searchComponents(args.query ?? "", args.top ?? 3);
      result = {
        query: args.query,
        matches: matches.map(({ item, score: s }) => ({
          name: item.name,
          title: item.title,
          description: item.description,
          score: s,
          react_install: `npx shadcn@latest add ${item.url}`,
          html_fetch: `curl -O ${RAW_BASE}/components/html/${item.name}/${item.name}.html`,
        })),
      };
    } else if (name === "get_component") {
      result = getComponent(args.id, args.stack ?? "react");
    } else if (name === "install_component") {
      result = installComponent(args.id, args.stack ?? "react", args.target_dir);
    } else {
      throw new Error(`unknown tool '${name}'`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

async function main() {
  // Fail fast if the checkout this server points at is incomplete.
  loadRegistry();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("unslop-mcp failed to start:", err.message);
  process.exit(1);
});
