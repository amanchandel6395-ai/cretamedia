const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2'
};

// Studio Departments Data (Exact 9 Verified Headquarters Scenes)
const DEPARTMENTS_DATA = [
  {
    id: 'exterior',
    index: 0,
    badge: 'SCENE 01 / EXTERIOR',
    title: 'Exterior Night Arrival',
    desc: 'Night-time architectural environment with illuminated company signage, moving light beams, and subtle atmospheric mist.',
    image: '/assets/images/creta-studio-hero-concept.png',
    hasVideo: false
  },
  {
    id: 'lobby',
    index: 1,
    badge: 'SCENE 02 / LOBBY',
    title: 'Lobby & Glass Entrance Portal',
    desc: 'Automatic sliding glass doors open smoothly into the reception. Polished Italian terrazzo, client plaques (Bluesky Ventures Dubai, Pran Food, Brightsun Canada), and studio milestones.',
    image: '/assets/images/creta-interior.png',
    hasVideo: false
  },
  {
    id: 'dubbing',
    index: 2,
    badge: 'SCENE 03 / DUBBING',
    title: 'Dubbing Department',
    desc: 'Professional acoustic dubbing isolation suite. Suspended gold condenser microphones, acoustic walnut diffusers, and live waveform sync monitors.',
    image: '/assets/images/creta-voice-studio.png',
    hasVideo: true,
    videoSrc: '/assets/videos/dubbing-session.mp4'
  },
  {
    id: 'localization',
    index: 3,
    badge: 'SCENE 04 / LOCALIZATION',
    title: 'Localization Department',
    desc: 'Global content transcreation hub. Interactive holographic world globe, glowing flight data arcs connecting international release hubs, and subtitle conform pipelines.',
    image: '/assets/images/creta-social-floor.png',
    hasVideo: false
  },
  {
    id: 'editing',
    index: 4,
    badge: 'SCENE 05 / EDITING',
    title: 'Video Editing Bay',
    desc: 'Cinematic post-production bay. Dual 32-inch OLED reference displays, hardware color grading panels, multi-track timelines, and real-time Before/After log-to-graded color transitions.',
    image: '/assets/images/creta-edit-suite.png',
    hasVideo: true,
    videoSrc: '/assets/videos/editing-session.mp4'
  },
  {
    id: 'audio-mixing',
    index: 5,
    badge: 'SCENE 06 / AUDIO THEATER',
    title: 'Audio Mixing Theater',
    desc: 'Subterranean Dolby Atmos style mixing auditorium. Stepped acoustic ceiling, surround sound speaker array, bass traps, and cinematic audio particle soundfield undulating in the room.',
    image: '/assets/images/creta-voice-studio.png',
    hasVideo: false
  },
  {
    id: 'ai-lab',
    index: 6,
    badge: 'SCENE 07 / AI LAB',
    title: 'AI Production Lab',
    desc: 'Futuristic research cleanroom. Obsidian glass surfaces, glowing neural conduits, rotating holographic wireframe character, voice cloning spectrum, and generative video pipelines.',
    image: '/assets/images/creta-studio-hero-concept.png',
    hasVideo: true,
    videoSrc: '/assets/videos/microdrama-scene-02.mp4'
  },
  {
    id: 'soundstage',
    index: 7,
    badge: 'SCENE 08 / SOUNDSTAGE',
    title: 'Production Floor & Soundstage',
    desc: 'Double-height film production floor. Green screen infinity cyclorama, cinema camera rig on motorized tracking dolly, overhead softbox lighting grid, and 9:16 vertical microdrama sets.',
    image: '/assets/images/microdrama-check.png',
    hasVideo: true,
    videoSrc: '/assets/videos/microdrama-01.mp4'
  },
  {
    id: 'showcase-hall',
    index: 8,
    badge: 'SCENE 09 / SHOWCASE',
    title: 'Grand Showcase Hall',
    desc: "Monumental presentation hall. Massive 20-meter curved panoramic LED wall, floating platform, illuminated gold 3D CTA 'Let's Create Something That Reaches The World.', and direct interactive portals for Google Drive and WhatsApp.",
    image: '/assets/images/creta-interior.png',
    hasVideo: true,
    videoSrc: '/assets/videos/creta-door-opening-animation.mp4'
  }
];

// In-Memory state for active studio room
let activeRoom = 0;

// OpenAPI 3.1 Specification for ChatGPT Actions & Rakazo
const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "CRETA MEDIA Production & Studio API",
    description: "Connect ChatGPT, Rakazo bots, and AI agents directly to CRETA MEDIA's 3D Virtual Studio, Dubbing pipeline (70+ languages), 4K Video Editing, and Microdrama production workflows.",
    version: "1.0.0"
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Local CRETA MEDIA Studio Server"
    }
  ],
  paths: {
    "/api/v1/departments": {
      get: {
        operationId: "getDepartments",
        summary: "List all 6 photorealistic studio departments and their live statuses",
        responses: {
          "200": {
            description: "List of studio departments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    activeRoom: { type: "integer" },
                    departments: { type: "array", items: { type: "object" } }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/departments/navigate": {
      post: {
        operationId: "navigateStudioDepartment",
        summary: "Navigate the 3D virtual studio to a specific department",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  departmentIndex: { type: "integer", minimum: 0, maximum: 5, description: "Department index: 0=Exterior, 1=Reception, 2=Dubbing, 3=Editing, 4=FilmSet, 5=SocialHub" }
                },
                required: ["departmentIndex"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Room changed successfully",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    },
    "/api/v1/services/voice-dubbing": {
      post: {
        operationId: "requestVoiceDubbing",
        summary: "Order voice dubbing, localization, or audio transcreation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  projectTitle: { type: "string" },
                  targetLanguages: { type: "array", items: { type: "string" } },
                  voiceStyle: { type: "string", description: "e.g. Cinematic, Commercial, Narrative, OTT Dub" },
                  scriptUrlOrText: { type: "string" }
                },
                required: ["projectTitle", "targetLanguages"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Dubbing request registered",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    },
    "/api/v1/services/video-editing": {
      post: {
        operationId: "requestVideoEditing",
        summary: "Submit a 4K DaVinci grading and video editing task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  projectName: { type: "string" },
                  aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1", "2.39:1"] },
                  colorProfile: { type: "string", description: "e.g. Film Emulation, HDR, Social Vivid" },
                  notes: { type: "string" }
                },
                required: ["projectName", "aspectRatio"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Video edit request created",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    },
    "/api/v1/services/microdrama": {
      post: {
        operationId: "requestMicrodramaSeries",
        summary: "Commission an original vertical microdrama series (episodes, hooks, pacing)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  genre: { type: "string" },
                  episodesCount: { type: "integer", default: 20 },
                  synopsis: { type: "string" },
                  targetAudience: { type: "string" }
                },
                required: ["genre", "synopsis"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Microdrama series queued",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    },
    "/api/v1/services/whatsapp": {
      post: {
        operationId: "sendWhatsAppMessage",
        summary: "Send a direct WhatsApp message to any phone number via scanned WhatsApp Web session (no password needed)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  to: { type: "string", description: "Phone number with country code, e.g. '919068734941'" },
                  message: { type: "string", description: "The WhatsApp message text" }
                },
                required: ["to", "message"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "WhatsApp message delivered",
            content: { "application/json": { schema: { type: "object" } } }
          }
        }
      }
    }
  }
};

const server = http.createServer((req, res) => {
  // Enable CORS for all incoming requests (ChatGPT, Rakazo, local apps)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // 1. ChatGPT Plugin Manifest
  if (pathname === '/.well-known/ai-plugin.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      schema_version: "v1",
      name_for_human: "CRETA MEDIA Studio",
      name_for_model: "creta_media_studio",
      description_for_human: "Connect to CRETA MEDIA 3D Virtual Studio, 70+ Language Dubbing & 4K Video Editing.",
      description_for_model: "Control the CRETA MEDIA 3D virtual studio, query department specs, and dispatch localization and video editing orders.",
      auth: { type: "none" },
      api: {
        type: "openapi",
        url: `http://localhost:${PORT}/openapi.json`
      },
      logo_url: `http://localhost:${PORT}/favicon.svg`,
      contact_email: "cretamediaofficial@gmail.com",
      legal_info_url: `http://localhost:${PORT}/#contact`
    }, null, 2));
    return;
  }

  // 2. OpenAPI Spec for ChatGPT Actions & Rakazo
  if (pathname === '/openapi.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(OPENAPI_SPEC, null, 2));
    return;
  }

  // 2b. Gemini Function Calling Tools Schema
  if (pathname === '/gemini-tools.json') {
    const geminiPath = path.join(__dirname, 'gemini-tools.json');
    if (fs.existsSync(geminiPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      fs.createReadStream(geminiPath).pipe(res);
      return;
    }
  }

  // 2c. WhatsApp QR Scanner Webpage
  if (pathname === '/whatsapp' || pathname === '/whatsapp/') {
    const waHtmlPath = path.join(DIST_DIR, 'whatsapp.html');
    if (fs.existsSync(waHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(waHtmlPath).pipe(res);
      return;
    }
  }

  // 2d. WhatsApp Status Proxy
  if (pathname === '/api/v1/whatsapp/status' && req.method === 'GET') {
    const proxyReq = http.get('http://localhost:3005/status', (proxyRes) => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
      proxyRes.pipe(res);
    });
    proxyReq.on('error', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ state: 'bridge_offline', error: 'WhatsApp bridge starting or offline' }));
    });
    return;
  }

  // 2e. WhatsApp Send Message Proxy
  if (pathname === '/api/v1/services/whatsapp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const proxyReq = http.request({
        hostname: 'localhost',
        port: 3005,
        path: '/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
        proxyRes.pipe(res);
      });
      proxyReq.on('error', () => {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'WhatsApp bridge is offline. Please launch START-WHATSAPP.bat' }));
      });
      proxyReq.write(body);
      proxyReq.end();
    });
    return;
  }

  // 3. REST API: GET /api/v1/departments
  if (pathname === '/api/v1/departments' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      activeRoom,
      totalDepartments: DEPARTMENTS_DATA.length,
      departments: DEPARTMENTS_DATA
    }, null, 2));
    return;
  }

  // 4. REST API: POST /api/v1/departments/navigate
  if (pathname === '/api/v1/departments/navigate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const index = parseInt(payload.departmentIndex, 10);
        if (isNaN(index) || index < 0 || index >= DEPARTMENTS_DATA.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Invalid departmentIndex. Must be between 0 and ${DEPARTMENTS_DATA.length - 1}` }));
          return;
        }
        activeRoom = index;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          activeRoom,
          department: DEPARTMENTS_DATA[activeRoom],
          message: `Studio navigated to ${DEPARTMENTS_DATA[activeRoom].title}`
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 5. REST API: POST /api/v1/services/voice-dubbing
  if (pathname === '/api/v1/services/voice-dubbing' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          jobId: `DUB-${Date.now()}`,
          status: "queued",
          service: "Voice Recording & Dubbing Booth",
          studioHardware: "Neumann U87 condenser mic + SSL Analog Console",
          supportedLanguages: "70+ languages worldwide",
          receivedData: data,
          timestamp: new Date().toISOString()
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 6. REST API: POST /api/v1/services/video-editing
  if (pathname === '/api/v1/services/video-editing' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          jobId: `EDIT-${Date.now()}`,
          status: "in-review",
          suite: "4K DaVinci Resolve Grading Suite",
          displays: "Ultrawide OLED Reference Monitors",
          receivedData: data,
          timestamp: new Date().toISOString()
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 7. REST API: POST /api/v1/services/microdrama
  if (pathname === '/api/v1/services/microdrama' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          seriesId: `MD-${Date.now()}`,
          stage: "Writers Room & Stage 05 (Film Set)",
          pacing: "Fast hook, 60-90s vertical episodes",
          receivedData: data,
          timestamp: new Date().toISOString()
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let cleanUrl = pathname;
  let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

  // Multi-page resolution: check exact, then .html, then /index.html, then fallback
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const range = req.headers.range;

  // HTTP 206 Partial Content for Video (.mp4) streaming
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`,
        'Access-Control-Allow-Origin': '*'
      });
      res.end();
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n========================================================`);
    console.log(`  ✅ CRETA MEDIA Studio is ALREADY running on port ${PORT}!`);
    console.log(`  🌐 Website & 3D Tour : http://localhost:${PORT}`);
    console.log(`  📱 WhatsApp Connect  : http://localhost:${PORT}/whatsapp`);
    console.log(`========================================================\n`);
    console.log(`The studio is already active and ready in your browser.\n`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n========================================================');
  console.log(`  🎬 CRETA MEDIA Studio & API Server is Running!`);
  console.log(`  🌐 Website & 3D Tour : ${url}`);
  console.log(`  📱 WhatsApp Connect  : ${url}/whatsapp`);
  console.log(`  🤖 OpenAPI Specification : ${url}/openapi.json`);
  console.log(`  🔌 ChatGPT Plugin Manifest: ${url}/.well-known/ai-plugin.json`);
  console.log(`  📦 Rakazo / REST Endpoints: ${url}/api/v1/departments`);
  console.log('========================================================\n');
});
