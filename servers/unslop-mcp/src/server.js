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
 *   audit_site(target, opts?)           run the pre-launch audit plugin, JSON findings
 *   shape_prompt(request, opts?)        vague request -> sharp Unslop-aware build brief
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
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

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
// audit_site — run the prelaunch-audit plugin (stdlib Python CLI) as a child
// process and return its machine-readable findings. Read-only: the plugin
// issues GET/HEAD requests only, never writes to the target.
// ---------------------------------------------------------------------------

const AUDIT_CLI = path.join(ROOT, "plugins", "prelaunch-audit", "audit");
const AUDIT_TIMEOUT_MS = 90000;

async function auditSite(target, opts = {}) {
  if (!target || typeof target !== "string" || !target.trim()) {
    throw new Error("target is required: a local site directory or http(s):// URL");
  }
  if (!fs.existsSync(AUDIT_CLI)) {
    throw new Error(`audit CLI not found at plugins/prelaunch-audit/audit (checkout incomplete?)`);
  }
  const args = [AUDIT_CLI, target.trim(), "--format", "json", "--no-fail"];
  if (opts.only) args.push("--only", String(opts.only));
  if (opts.skip) args.push("--skip", String(opts.skip));
  if (opts.check_external) args.push("--check-external");
  const maxPages = Math.min(Math.max(parseInt(opts.max_pages ?? 25, 10) || 25, 1), 200);
  args.push("--max-pages", String(maxPages));

  let stdout = "";
  try {
    ({ stdout } = await execFileAsync("python3", args, {
      timeout: AUDIT_TIMEOUT_MS,
      maxBuffer: 8 * 1024 * 1024,
    }));
  } catch (err) {
    if (err.killed) {
      throw new Error(`audit timed out after ${AUDIT_TIMEOUT_MS / 1000}s on '${target}'`);
    }
    if (err.stdout) {
      stdout = err.stdout; // --no-fail still prints JSON; exit code 1/2 is expected on failures
    } else {
      const tail = String(err.stderr || err.message || err).trim().split("\n").slice(-3).join(" ");
      throw new Error(`audit failed to run: ${tail}`);
    }
  }

  let data;
  try {
    data = JSON.parse(stdout);
  } catch {
    throw new Error(`audit produced no parseable JSON for '${target}'`);
  }
  if (!data || !Array.isArray(data.findings) || !data.summary) {
    throw new Error(`audit returned an unexpected payload for '${target}'`);
  }
  return {
    target: data.target,
    mode: data.mode,
    pages: data.pages,
    summary: data.summary,
    findings: data.findings,
    note: "Every finding carries a fix field with the concrete remediation. " +
      "Failures block launch; warnings are strongly advised before launch.",
  };
}

// ---------------------------------------------------------------------------
// shape_prompt — deterministic port of skills/prompt-shaper/SKILL.md.
// No LLM call: intent extraction, the 9-pattern token-efficiency audit, and
// the brief template are all rule-based; component matching reuses the same
// scorer as search_components so results rank identically.
// ---------------------------------------------------------------------------

const TASK_VERBS = ["build", "create", "make", "design", "add", "fix", "redesign", "rewrite", "implement", "launch", "ship"];
const INPUT_WORDS = ["copy", "brand", "logo", "content", "data", "screenshot", "text", "image", "asset", "photo"];
const DELIVERABLE_WORDS = ["page", "pages", "site", "website", "app", "component", "components", "section", "sections", "landing page", "dashboard", "form", "hero", "nav", "navbar", "footer", "brief"];
const STACK_WORDS = ["react", "tailwind", "nextjs", "next.js", "shadcn", "html", "css", "vue", "svelte", "vanilla"];
const HANDWAVES = ["modern", "clean", "professional", "nice", "beautiful", "awesome", "cool", "sleek", "polished", "stunning", "amazing", "minimalist"];
const SOFT_CONSTRAINTS = ["fast", "accessible", "responsive", "secure", "scalable", "performant", "lightweight"];

const TARGET_TOOLS = {
  "ai-coding-agent": "build task — files, stack, commands",
  "image-model": "visual spec — composition, style, what to avoid",
  "chat-assistant": "answer — depth, format, audience",
};

function detectTargetTool(request, hint) {
  if (hint && TARGET_TOOLS[hint]) {
    return { tool: hint, output: TARGET_TOOLS[hint], ambiguous: false };
  }
  const q = request.toLowerCase();
  const buildy = /\b(react|tailwind|html|css|site|website|page|component|app|landing|shadcn)\b/.test(q);
  const visual = /\b(logo|poster|thumbnail|illustration|wallpaper|cover art|icon)\b/.test(q);
  const hasBuildVerb = new RegExp(`\\b(${TASK_VERBS.join("|")})\\b`).test(q);
  const asky = /\b(explain|write|summarize|draft|answer|email|essay|post)\b/.test(q) && !hasBuildVerb;
  if (visual && !buildy && !hasBuildVerb) {
    return { tool: "image-model", output: TARGET_TOOLS["image-model"], ambiguous: false };
  }
  if (asky) {
    return { tool: "chat-assistant", output: TARGET_TOOLS["chat-assistant"], ambiguous: false };
  }
  if (visual && buildy) {
    // "make me a logo" — could be an image model or a designer agent. Ambiguous.
    return { tool: "ai-coding-agent", output: TARGET_TOOLS["ai-coding-agent"], ambiguous: true };
  }
  return { tool: "ai-coding-agent", output: TARGET_TOOLS["ai-coding-agent"], ambiguous: false };
}

function detectStack(request, hint) {
  if (hint === "react" || hint === "html") return hint;
  const q = request.toLowerCase();
  if (/\b(react|tailwind|nextjs|next\.js|shadcn)\b/.test(q)) return "react";
  if (/\b(html|css|vanilla|plain)\b/.test(q)) return "html";
  if (/\b(vue|svelte)\b/.test(q)) return "html"; // closest Unslop stack: framework-free
  return null;
}

function extractIntent(request) {
  const q = request.toLowerCase();
  const verbMatch = q.match(new RegExp(`\\b(${TASK_VERBS.join("|")})\\b`));
  const inputsFound = INPUT_WORDS.filter((w) => new RegExp(`\\b${w}s?\\b`).test(q));
  const outputsFound = DELIVERABLE_WORDS.filter((w) => q.includes(w));
  const stackFound = STACK_WORDS.filter((w) => {
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${esc}\\b`).test(q);
  });
  const audienceMatch = q.match(/\bfor\s+([a-z][a-z0-9'&.\- ]{2,44}?)(,|\.|$| who| that| with| on)/);
  const numberMatch = q.match(/\d+[^.\n]{0,40}/);
  const softFound = SOFT_CONSTRAINTS.filter((w) => new RegExp(`\\b${w}\\b`).test(q));

  return {
    task: verbMatch ? `${verbMatch[1]} — "${request.trim().replace(/[.\s]+$/, "")}"` : "MISSING (no action verb)",
    inputs: inputsFound.length ? inputsFound.join(", ") : "MISSING (agent will invent your brand, copy, and data)",
    outputs: outputsFound.length ? outputsFound.join(", ") : "MISSING (no concrete deliverable named)",
    constraints: stackFound.length ? `stack mentions: ${stackFound.join(", ")}` : "MISSING (stack not stated)",
    context: audienceMatch ? `for ${audienceMatch[1].trim()}` : "MISSING (what this is for, where it ships)",
    audience: audienceMatch ? audienceMatch[1].trim() : "MISSING (no named audience)",
    success_criteria: numberMatch
      ? `measurable hint found: "${numberMatch[0].trim()}"`
      : "MISSING (nothing says what 'done' looks like)",
    stop_conditions: "covered by the brief below",
    _soft: softFound,
    _hasAudience: Boolean(audienceMatch),
    _hasInputs: inputsFound.length > 0,
    _hasStack: stackFound.length > 0,
    _hasNumbers: Boolean(numberMatch),
  };
}

function creditKillerAudit(request, intent) {
  const q = request.toLowerCase();
  const hitsList = [];
  const hit = (pattern, found, fix) => hitsList.push({ pattern, found, fix });

  if (/\b(make|build|do|handle)\b\s+(something|it|this|that|stuff|things)\b/.test(q)) {
    hit("Vague verbs", "verb with no object", "Name the deliverable.");
  }
  if (!intent._hasNumbers) {
    hit("No success criteria", "nothing measurable in the request", "Add an acceptance checklist — a box is a criterion only if you can check it by looking.");
  }
  if (/\b(and maybe|while you'?re at it|might as well)\b/.test(q) || /\balso\b.{0,30}\b(add|include|build|throw in)\b/.test(q)) {
    hit("Unlocked scope", "'and maybe / also add' with no boundary", "Files-to-touch list; everything else is out of scope.");
  }
  hit("No stop conditions", "the request never says when to stop", "Explicit stop conditions in the brief.");
  const waves = HANDWAVES.filter((w) => new RegExp(`\\b${w}\\b`).test(q));
  if (waves.length) {
    hit("Handwaves", `"${waves.join('", "')}"`, "Replace adjectives with genre + design tokens + prohibitions.");
  }
  if (!intent._hasInputs) {
    hit("Missing inputs", "no brand/copy/data/assets mentioned", "Inputs section; inventing is forbidden unless the brief allows it.");
  }
  if (!intent._hasStack) {
    hit("Stack ambiguity", "React? HTML? 'whatever works'?", "Detect and state the stack (clarifying question #1).");
  }
  if (!intent._hasAudience) {
    hit("No audience", "designed for everyone, fits no one", "Name one audience.");
  }
  const softNoNumbers = intent._soft.filter((w) => !intent._hasNumbers);
  if (softNoNumbers.length) {
    hit("Invisible constraints", `"${softNoNumbers.join('", "')}" with no numbers`, "Numbers or it's not a constraint (e.g. LCP < 2.5s).");
  }
  return hitsList;
}

function clarifyingQuestions(request, intent, toolDetect) {
  const qs = [];
  if (!intent._hasStack) {
    qs.push({
      question: "React+Tailwind or plain HTML/CSS?",
      why: "stack ambiguity — changes every file in the build",
      default: "React+Tailwind (Unslop default; say 'html' for the framework-free pair)",
    });
  }
  if (toolDetect.ambiguous) {
    qs.push({
      question: "Is this for an AI coding agent, an image model, or a chat answer?",
      why: "target tool genuinely ambiguous (e.g. 'make me a logo')",
      default: "AI coding agent — the brief below assumes a build task",
    });
  }
  if (!intent._hasAudience) {
    qs.push({
      question: "Who is this for?",
      why: "no audience — 'users' is not an audience",
      default: "general visitors (flagged as an assumption in the brief)",
    });
  }
  if (!intent._hasInputs) {
    qs.push({
      question: "Do you have brand, copy, and assets ready, or should the build flag placeholders?",
      why: "missing inputs — the agent will otherwise invent your brand",
      default: "flag placeholders in Unslop voice for replacement",
    });
  }
  if (intent.context.startsWith("MISSING") && qs.length < 3) {
    qs.push({
      question: "What is this for — product, campaign, portfolio, internal tool?",
      why: "missing context — changes genre and voice",
      default: "product site (flagged as an assumption)",
    });
  }
  return qs.slice(0, 3); // never more than three
}

function matchComponents(request) {
  const scored = searchComponents(request, 5).filter((m) => m.score > 0).slice(0, 3);
  return scored.map((m) => ({
    name: m.item.name,
    title: m.item.title,
    reason: (m.item.description || "").split(".")[0].trim() + ".",
    react_install: `npx shadcn@latest add ${m.item.url}`,
  }));
}

const ANTI_SLOP = [
  "Flat color with conviction: one ink, one paper, one accent. No purple/blue gradients, no glassmorphism.",
  "Never center by default; asymmetry is a point of view.",
  "Genre-pick every layout (masthead, ledger, menu, letter, poster, colophon) before building.",
  "Corners are a decision; hard shadows stay hard.",
  "Motion: animate one thing on interaction, or nothing (see MOTION.md).",
  'Microcopy with a voice — no "revolutionize / unlock / seamless / cutting-edge".',
];

function emitBrief(request, intent, components, questions, tool, stack) {
  const goal = request.trim().replace(/[.\s]+$/, "");
  const cap = goal.charAt(0).toUpperCase() + goal.slice(1);
  const compLines = components.length
    ? components.map((c) => `- ${c.name} — ${c.reason}`).join("\n")
    : "- (none) — no registry component covers this request; build it in the Unslop style from DESIGN.md instead.";
  const files = [];
  if (stack === "react") {
    for (const c of components) files.push(`- components/${c.name}.tsx — new file: the ${c.title.toLowerCase()} build`);
    if (components.length) files.push("- app/page.tsx — mount the component(s)");
    files.push("- components/react/lib/utils.ts — copy the cn() helper if @/lib/utils doesn't have it");
  } else {
    for (const c of components) files.push(`- components/html/${c.name}/${c.name}.html + ${c.name}.css — reference pair (already in the library)`);
    if (!components.length) files.push("- new .html/.css pair in components/html/<name>/ — follow the library's file layout");
  }
  const assumptions = questions.map((x) => x.default).filter(Boolean);
  const brief = [
    `# Build brief: ${cap}`,
    "",
    `Target: ${tool.tool} → ${tool.output}. Stack: ${stack === "react" ? "React+Tailwind" : "framework-free HTML/CSS"}.`,
    "",
    "## Goal",
    `${cap}, in the Unslop style (human-grade, never AI-looking).`,
    "",
    "## Components to use",
    compLines,
    "",
    "## Files to touch",
    files.length ? files.join("\n") : "- (none identified — answer the clarifying questions first)",
    "",
    "## Design tokens",
    "- Ink / paper / accent: your call — one ink, one paper, one accent.",
    "- Type: display/body pairing with conviction (Unslop: system stacks only).",
    "- Genre: pick ONE before building — masthead | ledger | menu | letter | poster | colophon.",
    "",
    "## Acceptance checklist",
    `- [ ] The stated goal is visibly met: "${cap}"`,
    "- [ ] Breaks ≥3 DESIGN.md tells on purpose (no centered-everything hero, no gradient wash, no lorem ipsum)",
    "- [ ] Passes the design-intel self-review (skills/design-intel)",
    "",
    "## Stop conditions",
    "- The files above are done and the checklist checks out → stop and hand back.",
    "- A clarifying question goes unanswered → build with the stated default and flag the assumption.",
    "- Third-party approval or credentials needed → stop and report.",
    "",
    "## Anti-slop prohibitions",
    ...ANTI_SLOP.map((p) => `- ${p}`),
    ...(assumptions.length ? ["", `Assumptions taken: ${assumptions.join("; ")}`] : []),
  ];
  return brief.join("\n");
}

function shapePrompt(request, opts = {}) {
  if (!request || typeof request !== "string" || !request.trim()) {
    throw new Error("request is required: the vague build request to sharpen");
  }
  const tool = detectTargetTool(request, opts.targetTool);
  const stack = detectStack(request, opts.stack) || "react"; // Unslop default; flagged in questions when ambiguous
  const intent = extractIntent(request);
  const killers = creditKillerAudit(request, intent);
  const questions = clarifyingQuestions(request, intent, tool);
  const components = tool.tool === "ai-coding-agent" ? matchComponents(request) : [];
  const componentsNote = components.length
    ? undefined
    : tool.tool !== "ai-coding-agent"
      ? `No registry components for ${tool.tool} output — brief is a ${tool.output.split(" — ")[0]} instead.`
      : "No registry component covers this request — build it in the Unslop style from DESIGN.md instead.";
  const brief = emitBrief(request, intent, components, questions, tool, stack);

  return {
    request: request.trim(),
    target_tool: tool.tool,
    output_type: tool.output,
    stack: stack === "react" ? "React+Tailwind" : "framework-free HTML/CSS",
    stack_was_ambiguous: !detectStack(request, opts.stack),
    intent_dimensions: {
      task: intent.task,
      inputs: intent.inputs,
      outputs: intent.outputs,
      constraints: intent.constraints,
      context: intent.context,
      audience: intent.audience,
      success_criteria: intent.success_criteria,
      stop_conditions: intent.stop_conditions,
    },
    credit_killers: killers,
    clarifying_questions: questions,
    components,
    ...(componentsNote ? { components_note: componentsNote } : {}),
    brief,
    close: "Credits this brief saves: one guess-free build pass, zero restyle rounds.",
  };
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
  {
    name: "audit_site",
    description:
      "Run Unslop's pre-launch audit plugin (22 checks: seo, social/meta, " +
      "branding, links, images, forms, 404, leaked secrets, security headers, " +
      "page weight) against a local static-site directory or a deployed URL. " +
      "Returns summary counts plus every finding with a concrete fix. " +
      "Read-only: GET/HEAD requests only, never writes to the target.",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "Local site directory or http(s):// URL",
        },
        only: {
          type: "string",
          description:
            "Comma-separated check ids or categories to run (optional)",
        },
        skip: {
          type: "string",
          description:
            "Comma-separated check ids or categories to skip (optional)",
        },
        check_external: {
          type: "boolean",
          default: false,
          description: "Also verify external links (slower)",
        },
        max_pages: {
          type: "integer",
          minimum: 1,
          maximum: 200,
          default: 25,
          description: "Max pages to crawl in URL mode",
        },
      },
      required: ["target"],
    },
  },
  {
    name: "shape_prompt",
    description:
      "Turn a vague build request into a sharp Unslop-aware build brief " +
      "(deterministic port of the prompt-shaper skill, no LLM call): extracts " +
      "intent dimensions, runs the 9-pattern token-efficiency audit, asks at " +
      "most 3 clarifying questions with defaults, matches Unslop components, " +
      "and emits a one-page brief with DESIGN.md anti-slop prohibitions and " +
      "stop conditions.",
    inputSchema: {
      type: "object",
      properties: {
        request: {
          type: "string",
          description:
            "The vague request, e.g. 'build me a landing page'",
        },
        target_tool: {
          type: "string",
          enum: ["ai-coding-agent", "image-model", "chat-assistant"],
          description: "Override target-tool auto-detection",
        },
        stack: {
          type: "string",
          enum: ["react", "html"],
          description: "Override stack auto-detection",
        },
      },
      required: ["request"],
    },
  },
];

const server = new Server(
  { name: "unslop-mcp", version: "0.2.0" },
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
    } else if (name === "audit_site") {
      result = await auditSite(args.target, {
        only: args.only,
        skip: args.skip,
        check_external: args.check_external,
        max_pages: args.max_pages,
      });
    } else if (name === "shape_prompt") {
      result = shapePrompt(args.request ?? "", {
        targetTool: args.target_tool,
        stack: args.stack,
      });
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
