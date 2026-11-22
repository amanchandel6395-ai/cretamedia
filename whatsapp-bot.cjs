const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const http = require('http');
const path = require('path');
const fs = require('fs');

const SESSION_DIR = path.join(__dirname, 'whatsapp_session');
const BOT_PORT = 3005;

let sock = null;
let currentQR = null;
let currentQRDataUrl = null;
let connectionState = 'connecting';
let connectedUser = null;

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ['CRETA MEDIA Assistant', 'Chrome', '1.0.0']
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQR = qr;
      connectionState = 'qr_ready';
      try {
        currentQRDataUrl = await QRCode.toDataURL(qr);
      } catch (e) {
        currentQRDataUrl = null;
      }

      console.log('\n========================================================');
      console.log('  📱 SCAN THIS QR CODE WITH WHATSAPP TO CONNECT:');
      console.log('  Open WhatsApp -> Settings / 3-dots -> Linked Devices -> Link a Device');
      console.log('  Or open in browser: http://localhost:3000/whatsapp');
      console.log('========================================================\n');
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ WhatsApp connection closed. Reconnecting:', shouldReconnect);
      connectionState = 'disconnected';
      currentQR = null;
      currentQRDataUrl = null;
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      }
    } else if (connection === 'open') {
      connectionState = 'connected';
      currentQR = null;
      currentQRDataUrl = null;
      connectedUser = sock.user?.id || 'Connected User';
      console.log('\n========================================================');
      console.log('  ✅ WHATSAPP CONNECTED SUCCESSFULLY!');
      console.log('  👤 User:', connectedUser);
      console.log('  🚀 Creta Media & Gemini can now send WhatsApp alerts!');
      console.log('========================================================\n');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Incoming WhatsApp message handler
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

      if (text) {
        console.log(`📥 Incoming WhatsApp from [${from}]: ${text}`);

        // Quick auto-reply for Creta Media keywords
        const lower = text.toLowerCase().trim();
        if (lower === 'hi' || lower === 'hello' || lower === 'creta' || lower === 'menu') {
          await sock.sendMessage(from, {
            text: "🎬 *Welcome to CRETA MEDIA Studio Assistant!*\n\nHow can we help you today?\n1️⃣ *Studio Tour:* http://localhost:3000\n2️⃣ *Voice Dubbing:* 70+ Languages worldwide\n3️⃣ *4K DaVinci Video Editing*\n4️⃣ *Microdrama Vertical Series*\n\nReply with what you need, and our team will assist you!"
          });
        }
      }
    } catch (e) {
      console.error('Error handling incoming WhatsApp message:', e);
    }
  });
}

// HTTP API server on port 3005 for internal sending
const apiServer = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${BOT_PORT}`);

  // Status endpoint
  if (url.pathname === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      state: connectionState,
      connectedUser,
      hasQr: !!currentQR,
      qrDataUrl: currentQRDataUrl
    }));
    return;
  }

  // Send message endpoint
  if (url.pathname === '/send' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { to, message } = JSON.parse(body || '{}');

        if (!to || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Missing 'to' (phone number) or 'message'" }));
          return;
        }

        if (connectionState !== 'connected' || !sock) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "WhatsApp is not connected yet. Please scan the QR code first." }));
          return;
        }

        // Format recipient JID (e.g. 919068734941@s.whatsapp.net)
        let cleanNumber = to.replace(/[^0-9]/g, '');
        if (!cleanNumber.endsWith('@s.whatsapp.net')) {
          cleanNumber = `${cleanNumber}@s.whatsapp.net`;
        }

        await sock.sendMessage(cleanNumber, { text: message });
        console.log(`📤 WhatsApp sent to ${cleanNumber}: ${message.slice(0, 50)}...`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, to: cleanNumber, message }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

apiServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n✅ WhatsApp Bridge is ALREADY running on port ${BOT_PORT}!`);
    console.log(`🌐 Open http://localhost:3000/whatsapp to view QR or send messages.`);
    process.exit(0);
  } else {
    console.error('API Server error:', err);
  }
});

apiServer.listen(BOT_PORT, () => {
  console.log(`📡 WhatsApp API Bridge listening on http://localhost:${BOT_PORT}`);
  startWhatsAppBot();
});
