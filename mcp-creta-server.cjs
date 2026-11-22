#!/usr/bin/env node
/**
 * CRETA MEDIA — Model Context Protocol (MCP) Server
 * Compatible with Rakazo (@modelcontextprotocol/sdk), Claude Desktop, Cursor, Antigravity & ChatGPT MCP Bridges.
 */

const readline = require('readline');
const http = require('http');

const TOOLS = [
  {
    name: "creta_list_departments",
    description: "Returns all 6 photorealistic departments in the CRETA MEDIA virtual production studio (Exterior, Reception, Dubbing, Edit Suite, Film Set, Social Hub) along with active statuses.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "creta_navigate_department",
    description: "Switches the 3D studio tour view to a target department (0=Exterior, 1=Reception, 2=Dubbing, 3=Editing, 4=FilmSet, 5=SocialHub).",
    inputSchema: {
      type: "object",
      properties: {
        departmentIndex: {
          type: "integer",
          minimum: 0,
          maximum: 5,
          description: "Department index to focus on (0 to 5)"
        }
      },
      required: ["departmentIndex"]
    }
  },
  {
    name: "creta_order_dubbing",
    description: "Queues a multilingual dubbing, voice-over, or audio post-production project for 70+ languages with Neumann U87 and SSL console specs.",
    inputSchema: {
      type: "object",
      properties: {
        projectTitle: { type: "string", description: "Title of project" },
        targetLanguages: {
          type: "array",
          items: { type: "string" },
          description: "Target languages (e.g. ['Hindi', 'Spanish', 'Japanese'])"
        },
        voiceStyle: { type: "string", description: "Vocal style e.g. OTT Dramatic, Commercial, Character" }
      },
      required: ["projectTitle", "targetLanguages"]
    }
  },
  {
    name: "creta_order_video_editing",
    description: "Requests 4K DaVinci Resolve color grading, dialogue cleanup, sound design, and master delivery in 16:9 or 9:16.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string" },
        aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1", "2.39:1"] },
        colorProfile: { type: "string" }
      },
      required: ["projectName", "aspectRatio"]
    }
  },
  {
    name: "creta_order_microdrama",
    description: "Commissions an original vertical mobile microdrama series with fast pacing, cliffhangers, and platform release packaging.",
    inputSchema: {
      type: "object",
      properties: {
        genre: { type: "string" },
        episodesCount: { type: "integer", default: 20 },
        synopsis: { type: "string" }
      },
      required: ["genre", "synopsis"]
    }
  },
  {
    name: "creta_send_whatsapp",
    description: "Sends a real WhatsApp message to any phone number (e.g. 919068734941) using the scanned WhatsApp Web session. No password or API token required.",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient phone number with country code, e.g. 919068734941" },
        message: { type: "string", description: "Message body" }
      },
      required: ["to", "message"]
    }
  }
];

// Helper to make local API call
function callLocalApi(method, path, data) {
  return new Promise((resolve) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({ raw: body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, status: "Local studio server offline on port 3000" });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: "creta-media-mcp",
            version: "1.0.0"
          }
        }
      };
      console.log(JSON.stringify(response));
      return;
    }

    if (method === 'ping') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id, result: {} }));
      return;
    }

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
      console.log(JSON.stringify(response));
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};
      let resultData = null;

      if (toolName === 'creta_list_departments') {
        resultData = await callLocalApi('GET', '/api/v1/departments');
      } else if (toolName === 'creta_navigate_department') {
        resultData = await callLocalApi('POST', '/api/v1/departments/navigate', args);
      } else if (toolName === 'creta_order_dubbing') {
        resultData = await callLocalApi('POST', '/api/v1/services/voice-dubbing', args);
      } else if (toolName === 'creta_order_video_editing') {
        resultData = await callLocalApi('POST', '/api/v1/services/video-editing', args);
      } else if (toolName === 'creta_order_microdrama') {
        resultData = await callLocalApi('POST', '/api/v1/services/microdrama', args);
      } else if (toolName === 'creta_send_whatsapp') {
        resultData = await callLocalApi('POST', '/api/v1/services/whatsapp', args);
      } else {
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool '${toolName}' not found.` }
        }));
        return;
      }

      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(resultData, null, 2)
            }
          ]
        }
      }));
      return;
    }

    // Default unrecognized method
    console.log(JSON.stringify({
      jsonrpc: '2.0',
      id,
      result: {}
    }));
  } catch (e) {
    // ignore parse errors or malformed json
  }
});
