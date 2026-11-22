# CRETA MEDIA — Connectors & App Integrations Guide

Connect **CRETA MEDIA** tools, virtual studio controls, dubbing workflows, and 4K editing services to **ChatGPT**, **Rakazo Teammates**, and any external AI agents.

---

## 1. ChatGPT Connector (Custom GPT Action)

To connect CRETA MEDIA to **ChatGPT**:

1. Go to **ChatGPT** -> **Explore GPTs** -> **Create a GPT**.
2. Go to the **Configure** tab and click **Create new action**.
3. Under **Schema**, choose **Import from URL** and enter:
   ```text
   http://localhost:3000/openapi.json
   ```
   *(Or if running on a domain or cloud, `https://your-domain.com/openapi.json`)*
4. ChatGPT will automatically discover all 5 tools:
   - `getDepartments`: List 6 virtual studio departments & live statuses.
   - `navigateStudioDepartment`: Switch 3D camera to target department.
   - `requestVoiceDubbing`: Request multilingual localization in 70+ languages.
   - `requestVideoEditing`: Order 4K DaVinci grading & video cutting.
   - `requestMicrodramaSeries`: Order vertical drama episodes with cliffhangers.

ChatGPT can now directly control the studio and queue production orders in conversational English or Hindi!

---

## 2. Rakazo Teammate Connector (MCP Protocol)

Your workspace includes the open-source **Rakazo** monorepo in `./rakazo`. Rakazo natively supports the **Model Context Protocol (MCP)** via `@modelcontextprotocol/sdk`.

### Quick Rakazo Setup:

We have prepared the configuration file: [`rakazo-connector-config.json`](file:///c:/Users/Aman%20Pal/OneDrive/Desktop/Creta%20Media/rakazo-connector-config.json)

In Rakazo's MCP server registry or bot settings:
```json
{
  "mcpServers": {
    "creta-media": {
      "command": "node",
      "args": [
        "c:/Users/Aman Pal/OneDrive/Desktop/Creta Media/mcp-creta-server.cjs"
      ]
    }
  }
}
```

Once connected, your Rakazo bots gain direct tool-calling capability for:
- `creta_list_departments`
- `creta_navigate_department`
- `creta_order_dubbing`
- `creta_order_video_editing`
- `creta_order_microdrama`

---

## 3. Direct REST API Endpoints (Local & Webhooks)

All endpoints support full CORS (`*`) and return clean JSON:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/openapi.json` | Complete OpenAPI 3.1 schema |
| `GET` | `/.well-known/ai-plugin.json` | ChatGPT AI Plugin Manifest |
| `GET` | `/api/v1/departments` | Get all 6 photorealistic studio rooms & metadata |
| `POST` | `/api/v1/departments/navigate` | Navigate 3D camera (`{"departmentIndex": 2}`) |
| `POST` | `/api/v1/services/voice-dubbing` | Order dubbing (`{"projectTitle": "...", "targetLanguages": [...]}`) |
| `POST` | `/api/v1/services/video-editing` | Order 4K edit (`{"projectName": "...", "aspectRatio": "9:16"}`) |
| `POST` | `/api/v1/services/microdrama` | Order vertical series (`{"genre": "Drama", "synopsis": "..."}`) |
