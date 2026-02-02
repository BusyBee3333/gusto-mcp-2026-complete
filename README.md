> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/gusto)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 💼 Gusto MCP Server — HR & Payroll Intelligence

## 💡 What This Unlocks

**This MCP server gives AI direct access to your Gusto HR and payroll data.** Stop manually exporting spreadsheets or hunting through dashboards. Ask Claude questions in plain English, and get instant answers.

### 🎯 Gusto-Specific Power Moves

| Use Case | What It Does | Tools Used |
|----------|-------------|-----------|
| **Headcount reporting** | Get current employee list with salaries, departments, roles | `list_employees`, `get_employee` |
| **Payroll reconciliation** | Pull processed payrolls for a date range, verify amounts | `list_payrolls`, `get_payroll` |
| **Contractor audit** | List all 1099 contractors and YTD payments | `list_contractors` |
| **Benefits enrollment check** | See who's enrolled in health, 401k, etc. | `list_benefits`, `list_employees` |
| **Company info export** | Get all company details, locations, tax IDs | `get_company` |

### 🔗 The Real Power: Natural Language HR Queries

Instead of logging into Gusto and clicking around:

- *"Show me all employees hired in the last 6 months"*
- *"What's our total payroll for Q4 2024?"*
- *"List all contractors with payments over $10k this year"*
- *"Who's enrolled in our health insurance plan?"*
- *"Get company details including all locations"*

## 📦 What's Inside

**7 HR-focused API tools** covering Gusto's core people operations:

- **Employees:** `list_employees`, `get_employee` — Staff directory, salaries, departments
- **Payroll:** `list_payrolls`, `get_payroll` — Pay runs, gross/net amounts, taxes
- **Contractors:** `list_contractors` — 1099 contractors and payments
- **Company:** `get_company` — Organization details, locations, settings
- **Benefits:** `list_benefits` — Health insurance, 401k, other benefits

All with OAuth2 bearer token authentication, proper error handling, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Recommended)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Gusto-MCP-2026-Complete.git
   cd gusto-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Gusto OAuth token:**
   - Log into [Gusto Developer Portal](https://dev.gusto.com/)
   - Create a new application
   - Complete the OAuth flow to get an **access token**
   - **Note:** Gusto uses OAuth2, so you'll need to implement a refresh flow for production use

3. **Configure Claude Desktop:**
   
   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "gusto": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/gusto-mcp-2026-complete/dist/index.js"],
         "env": {
           "GUSTO_ACCESS_TOKEN": "your-oauth-access-token"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop** — you'll see 7 Gusto tools appear in the MCP section

### Option 2: Local Development

```bash
cp .env.example .env
# Edit .env with your Gusto OAuth token
npm run dev
```

## 🔐 Authentication

Gusto uses **OAuth2** for authentication:

1. Go to [Gusto Developer Portal](https://dev.gusto.com/)
2. Create a new **Partner Application**
3. Configure OAuth redirect URIs
4. Use the OAuth flow to obtain an **access token**
5. Set `GUSTO_ACCESS_TOKEN` in your environment

**Required Scopes:**
- `employees:read`
- `payrolls:read`
- `contractors:read`
- `company:read`
- `benefits:read`

**API Docs:** [https://docs.gusto.com/](https://docs.gusto.com/)

**⚠️ Token Expiration:** Access tokens expire after a certain period. For production, implement token refresh using Gusto's OAuth refresh flow.

## 🎯 Example Prompts

Once connected to Claude:

**Employee Management:**
- *"List all employees in the Engineering department"*
- *"Show me details for employee ID abc123"*
- *"Who are our newest hires?"*

**Payroll Analysis:**
- *"Pull all processed payrolls from January 2025"*
- *"Show me payroll details for ID xyz789"*
- *"What's our average gross payroll per run?"*

**Contractor Management:**
- *"List all contractors"*
- *"Which contractors have YTD payments over $50k?"*

**Company & Benefits:**
- *"Get our company information"*
- *"What benefits do we offer?"*
- *"How many employees are enrolled in 401k?"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Gusto account with API access (requires partner application setup)

### Local Setup

```bash
git clone https://github.com/BusyBee3333/Gusto-MCP-2026-Complete.git
cd gusto-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your OAuth token
npm run build
npm start
```

### Project Structure

```
gusto-mcp-2026-complete/
├── src/
│   └── index.ts          # Main MCP server + Gusto API client
├── dist/                 # Compiled JavaScript (npm run build)
├── package.json
├── tsconfig.json
└── .env.example
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Gusto API error: 401 Unauthorized"
- Your access token is invalid or expired
- Generate a new token through the OAuth flow
- Verify you've set `GUSTO_ACCESS_TOKEN` correctly

### "Gusto API error: 403 Forbidden"
- Your OAuth application doesn't have the required scopes
- Check your app's permissions in the Gusto Developer Portal

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating `claude_desktop_config.json`
- Verify the path is **absolute** (no `~` or relative paths)
- Check that `npm run build` completed successfully
- Look for the `dist/index.js` file

### "company_id required"
- Most Gusto API calls require a `company_id` parameter
- Get your company ID via the `get_company()` tool first
- Or find it in your Gusto dashboard URL

## 📖 Resources

- [Gusto API Documentation](https://docs.gusto.com/)
- [Gusto Developer Portal](https://dev.gusto.com/)
- [OAuth 2.0 Guide](https://docs.gusto.com/embedded-payroll/docs/oauth)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Setup](https://claude.ai/desktop)

## 🤝 Contributing

Contributions welcome! To add new Gusto API endpoints:

1. Fork the repo
2. Add tool definitions to `src/index.ts` (tools array)
3. Implement handlers in `handleTool()` function
4. Update README with new capabilities
5. Submit a PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

**Want more MCP servers?** Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms (Toast, Calendly, Stripe, QuickBooks, and more).

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
