import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { fetchShireJson } from "./client.js";

const planningToolIds = [
  "automation-opportunity-scorecard",
  "workflow-mapper",
  "lead-response-calculator",
  "ai-readiness-assessment",
  "integration-finder",
  "client-onboarding-builder",
  "invoice-follow-up-calculator",
  "roi-calculator",
];

function createServer() {
  const server = new McpServer({ name: "shireautomations", version: "0.1.0" });

  server.registerTool("shire_catalog", {
    description: "Read Shire Automations services, starting prices, and public planning tools. Does not create a quote or start paid work.",
    inputSchema: z.object({}),
  }, async () => {
    const catalog = await fetchShireJson("/api/v1/catalog");
    return { content: [{ type: "text", text: JSON.stringify(catalog, null, 2) }] };
  });

  server.registerTool("shire_list_planning_tools", {
    description: "List the public Shire Automations workflow planning calculators.",
    inputSchema: z.object({}),
  }, async () => {
    const tools = await fetchShireJson("/api/v1/tools");
    return { content: [{ type: "text", text: JSON.stringify(tools, null, 2) }] };
  });

  server.registerTool("shire_plan", {
    description: "Run one stateless Shire workflow planning tool using values you provide. Results are estimates, not forecasts. Do not send credentials or sensitive customer, patient, or financial-account data.",
    inputSchema: z.object({
      tool: z.enum(planningToolIds),
      input: z.record(z.string(), z.unknown()),
    }),
  }, async ({ tool, input }) => {
    const result = await fetchShireJson(`/api/v1/tools/${encodeURIComponent(tool)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  return server;
}

await serveStdio(createServer);
console.error("Shire Automations MCP server ready on stdio.");
