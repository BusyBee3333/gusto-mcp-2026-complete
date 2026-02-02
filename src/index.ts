#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "gusto";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.gusto.com/v1";

// ============================================
// API CLIENT
// ============================================
class GustoClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gusto API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Employee endpoints
  async listEmployees(companyId: string, page?: number, per?: number) {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (per) params.append("per", per.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/companies/${companyId}/employees${query}`);
  }

  async getEmployee(employeeId: string) {
    return this.get(`/employees/${employeeId}`);
  }

  // Payroll endpoints
  async listPayrolls(companyId: string, processed?: boolean, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (processed !== undefined) params.append("processed", processed.toString());
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/companies/${companyId}/payrolls${query}`);
  }

  async getPayroll(companyId: string, payrollId: string) {
    return this.get(`/companies/${companyId}/payrolls/${payrollId}`);
  }

  // Contractor endpoints
  async listContractors(companyId: string, page?: number, per?: number) {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (per) params.append("per", per.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/companies/${companyId}/contractors${query}`);
  }

  // Company endpoints
  async getCompany(companyId: string) {
    return this.get(`/companies/${companyId}`);
  }

  // Benefits endpoints
  async listBenefits(companyId: string) {
    return this.get(`/companies/${companyId}/company_benefits`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_employees",
    description: "List all employees for a company in Gusto",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
        page: { type: "number", description: "Page number for pagination" },
        per: { type: "number", description: "Number of results per page (max 100)" },
      },
      required: ["company_id"],
    },
  },
  {
    name: "get_employee",
    description: "Get details of a specific employee by ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        employee_id: { type: "string", description: "The employee UUID" },
      },
      required: ["employee_id"],
    },
  },
  {
    name: "list_payrolls",
    description: "List payrolls for a company, optionally filtered by date range and processing status",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
        processed: { type: "boolean", description: "Filter by processed status" },
        start_date: { type: "string", description: "Start date filter (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date filter (YYYY-MM-DD)" },
      },
      required: ["company_id"],
    },
  },
  {
    name: "get_payroll",
    description: "Get details of a specific payroll",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
        payroll_id: { type: "string", description: "The payroll ID or UUID" },
      },
      required: ["company_id", "payroll_id"],
    },
  },
  {
    name: "list_contractors",
    description: "List all contractors for a company",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
        page: { type: "number", description: "Page number for pagination" },
        per: { type: "number", description: "Number of results per page" },
      },
      required: ["company_id"],
    },
  },
  {
    name: "get_company",
    description: "Get company details including locations and settings",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
      },
      required: ["company_id"],
    },
  },
  {
    name: "list_benefits",
    description: "List all company benefits (health insurance, 401k, etc.)",
    inputSchema: {
      type: "object" as const,
      properties: {
        company_id: { type: "string", description: "The company UUID" },
      },
      required: ["company_id"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: GustoClient, name: string, args: any) {
  switch (name) {
    case "list_employees": {
      const { company_id, page, per } = args;
      return await client.listEmployees(company_id, page, per);
    }
    case "get_employee": {
      const { employee_id } = args;
      return await client.getEmployee(employee_id);
    }
    case "list_payrolls": {
      const { company_id, processed, start_date, end_date } = args;
      return await client.listPayrolls(company_id, processed, start_date, end_date);
    }
    case "get_payroll": {
      const { company_id, payroll_id } = args;
      return await client.getPayroll(company_id, payroll_id);
    }
    case "list_contractors": {
      const { company_id, page, per } = args;
      return await client.listContractors(company_id, page, per);
    }
    case "get_company": {
      const { company_id } = args;
      return await client.getCompany(company_id);
    }
    case "list_benefits": {
      const { company_id } = args;
      return await client.listBenefits(company_id);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const accessToken = process.env.GUSTO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Error: GUSTO_ACCESS_TOKEN environment variable required");
    console.error("Obtain an OAuth2 access token from Gusto's developer portal");
    process.exit(1);
  }

  const client = new GustoClient(accessToken);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
