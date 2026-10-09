/**
 * stdio integration tests for unslop-mcp.
 * Spawns the server and speaks JSON-RPC 2.0 over stdin/stdout.
 * stdlib only: node:test + node:assert + node:child_process.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SERVER = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "server.js"
);

class RpcClient {
  constructor() {
    this.proc = spawn("node", [SERVER], { stdio: ["pipe", "pipe", "pipe"] });
    this.id = 0;
    this.buf = "";
    this.waiters = new Map();
    this.proc.stdout.on("data", (d) => this.onData(d));
    this.stderr = "";
    this.proc.stderr.on("data", (d) => (this.stderr += d));
  }
  onData(d) {
    this.buf += d.toString();
    let idx;
    while ((idx = this.buf.indexOf("\n")) !== -1) {
      const line = this.buf.slice(0, idx).trim();
      this.buf = this.buf.slice(idx + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      const w = this.waiters.get(msg.id);
      if (w) {
        this.waiters.delete(msg.id);
        w(msg);
      }
    }
  }
  request(method, params) {
    const id = ++this.id;
    return new Promise((resolve) => {
      this.waiters.set(id, resolve);
      this.proc.stdin.write(
        JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"
      );
    });
  }
  notify(method, params) {
    this.proc.stdin.write(
      JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n"
    );
  }
  close() {
    this.proc.kill();
  }
}

function textOf(result) {
  return result.result.content.map((c) => c.text).join("\n");
}

let client;

test("setup: server starts and answers initialize", async () => {
  client = new RpcClient();
  const res = await client.request("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "test", version: "0.0.0" },
  });
  assert.ok(res.result.serverInfo, "no serverInfo in initialize result");
  assert.equal(res.result.serverInfo.name, "unslop-mcp");
  client.notify("notifications/initialized", {});
});

test("tools/list exposes the three tools", async () => {
  const res = await client.request("tools/list", {});
  const names = res.result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["get_component", "install_component", "search_components"]);
});

test("search_components: 'pricing section for a coffee brand' -> pricing", async () => {
  const res = await client.request("tools/call", {
    name: "search_components",
    arguments: { query: "pricing section for a coffee brand" },
  });
  const data = JSON.parse(textOf(res));
  assert.ok(data.matches.length > 0);
  assert.equal(data.matches[0].name, "pricing");
  assert.ok(data.matches[0].score > 0);
});

test("search_components: 'hero banner for landing page' -> hero", async () => {
  const res = await client.request("tools/call", {
    name: "search_components",
    arguments: { query: "hero banner for landing page" },
  });
  const data = JSON.parse(textOf(res));
  assert.equal(data.matches[0].name, "hero");
});

test("search_components: matches agree with the Python router", async () => {
  // Parity check against the authoritative scorer: ./unslop find.
  // The MCP port must rank the same winner for a handful of queries.
  const queries = [
    ["testimonials for a product site", "testimonials"],
    ["faq accordion section", "faq"],
    ["footer with sitemap links", "footer"],
    ["contact form with email field", "contact-form"],
  ];
  for (const [query, expected] of queries) {
    const res = await client.request("tools/call", {
      name: "search_components",
      arguments: { query },
    });
    const data = JSON.parse(textOf(res));
    assert.equal(data.matches[0].name, expected, `query: ${query}`);
  }
});

test("get_component: button (react) returns inline source", async () => {
  const res = await client.request("tools/call", {
    name: "get_component",
    arguments: { id: "button", stack: "react" },
  });
  const data = JSON.parse(textOf(res));
  assert.equal(data.name, "button");
  assert.equal(data.stack, "react");
  const paths = data.files.map((f) => f.path);
  assert.ok(paths.some((p) => p.endsWith("Button.tsx")), `paths: ${paths}`);
  const tsx = data.files.find((f) => f.path.endsWith("Button.tsx")).content;
  assert.ok(tsx.includes("The Honest Button"), "expected component comment in source");
  assert.ok(data.install_with.includes("shadcn"), "expected shadcn install hint");
});

test("get_component: button (html) returns the html/css pair", async () => {
  const res = await client.request("tools/call", {
    name: "get_component",
    arguments: { id: "button", stack: "html" },
  });
  const data = JSON.parse(textOf(res));
  assert.equal(data.stack, "html");
  const paths = data.files.map((f) => f.path).sort();
  assert.deepEqual(paths, ["button.css", "button.html"]);
  assert.ok(data.stylesheet_link.includes("button.css"));
});

test("get_component: unknown id returns an error", async () => {
  const res = await client.request("tools/call", {
    name: "get_component",
    arguments: { id: "does-not-exist" },
  });
  assert.equal(res.result.isError, true);
  assert.ok(textOf(res).includes("unknown component"));
});

test("install_component: html stack writes the pair to target_dir", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "unslop-mcp-"));
  const res = await client.request("tools/call", {
    name: "install_component",
    arguments: { id: "pricing", stack: "html", target_dir: tmp },
  });
  const data = JSON.parse(textOf(res));
  assert.deepEqual(data.written.sort(), ["pricing.css", "pricing.html"]);
  for (const f of data.written) {
    assert.ok(fs.existsSync(path.join(tmp, f)), `missing written file ${f}`);
  }
  assert.ok(data.next.includes("pricing.css"), "expected <link> next-step hint");
  fs.rmSync(tmp, { recursive: true });
});

test("install_component: react stack writes bundle paths", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "unslop-mcp-"));
  const res = await client.request("tools/call", {
    name: "install_component",
    arguments: { id: "faq", stack: "react", target_dir: tmp },
  });
  const data = JSON.parse(textOf(res));
  assert.ok(data.written.length > 0);
  for (const f of data.written) {
    assert.ok(fs.existsSync(path.join(tmp, f)), `missing written file ${f}`);
    assert.ok(
      path.resolve(tmp, f).startsWith(path.resolve(tmp) + path.sep),
      `path escaped target dir: ${f}`
    );
  }
  fs.rmSync(tmp, { recursive: true });
});

test("install_component: unknown id returns an error", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "unslop-mcp-"));
  const res = await client.request("tools/call", {
    name: "install_component",
    arguments: { id: "nope", stack: "react", target_dir: tmp },
  });
  assert.equal(res.result.isError, true);
  fs.rmSync(tmp, { recursive: true });
});

test("teardown", () => {
  client.close();
  assert.equal(client.stderr.trim(), "", `server wrote to stderr: ${client.stderr}`);
});
