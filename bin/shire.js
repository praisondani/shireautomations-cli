#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { stdin, stdout, stderr } from "node:process";
import { fetchShireJson } from "../src/client.js";

const HELP = `Shire Automations CLI

Usage:
  shire catalog
  shire services
  shire pricing
  shire tools
  shire plan <tool> --input <file|->
  shire mcp

Planning results are estimates from your inputs. Requests are not saved by the API.
Set SHIRE_API_URL to use another Shire-compatible API origin.`;

function print(value) {
  stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function readStdin() {
  let value = "";
  for await (const chunk of stdin) value += chunk;
  return value;
}

async function readInput(args) {
  const index = args.indexOf("--input");
  if (index === -1 || !args[index + 1]) throw new Error("Pass --input <file|-> with a JSON object.");
  const raw = args[index + 1] === "-" ? await readStdin() : await readFile(args[index + 1], "utf8");
  const value = JSON.parse(raw);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The planning input must be a JSON object.");
  }
  return value;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    stdout.write(`${HELP}\n`);
    return;
  }

  if (command === "mcp") {
    await import("../src/mcp.js");
    return;
  }

  if (command === "catalog") {
    print(await fetchShireJson("/api/v1/catalog"));
    return;
  }

  if (command === "services" || command === "pricing") {
    const catalog = await fetchShireJson("/api/v1/catalog");
    print(command === "services" ? catalog.services : { pricing: catalog.pricing, note: catalog.pricingNote });
    return;
  }

  if (command === "tools") {
    print(await fetchShireJson("/api/v1/tools"));
    return;
  }

  if (command === "plan") {
    const slug = args[0];
    if (!slug) throw new Error("Pass the planning tool name after plan.");
    const input = await readInput(args.slice(1));
    print(await fetchShireJson(`/api/v1/tools/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    }));
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${HELP}`);
}

main().catch((error) => {
  stderr.write(`${error instanceof Error ? error.message : "Shire request failed."}\n`);
  process.exitCode = 1;
});
