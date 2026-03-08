const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const PORT = Number(process.env.BOMB_BACKEND_PORT || 5050);
const repoRoot = path.resolve(__dirname, '..', '..');
const bridgePath = path.join(repoRoot, 'backend_bridge');

function compileBridge() {
  return new Promise((resolve, reject) => {
    const args = [
      '-std=c++17',
      '-Wall',
      '-Wextra',
      '-pedantic',
      'backend_bridge.cpp',
      'bomb.cpp',
      'solution.cpp',
      'wire.cpp',
      'player.cpp',
      'game_master.cpp',
      '-o',
      'backend_bridge',
    ];

    const compile = spawn('clang++', args, { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    compile.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    compile.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to compile backend bridge.\n${stderr}`));
      }
    });

    compile.on('error', (err) => reject(err));
  });
}

function startBridge() {
  const bridge = spawn(bridgePath, [], {
    cwd: repoRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let buffer = '';
  const pending = [];

  bridge.stdout.on('data', (chunk) => {
    buffer += chunk.toString();

    while (true) {
      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex === -1) {
        break;
      }

      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      const next = pending.shift();
      if (next) {
        try {
          next.resolve(JSON.parse(line));
        } catch (err) {
          next.reject(new Error(`Invalid bridge JSON: ${line}`));
        }
      }
    }
  });

  bridge.stderr.on('data', (chunk) => {
    process.stderr.write(`[bridge] ${chunk}`);
  });

  bridge.on('exit', (code) => {
    while (pending.length > 0) {
      const next = pending.shift();
      if (next) {
        next.reject(new Error(`Bridge exited with code ${code}`));
      }
    }
  });

  function send(command) {
    return new Promise((resolve, reject) => {
      pending.push({ resolve, reject });
      bridge.stdin.write(`${command}\n`);
    });
  }

  return { send, bridge };
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, code, body) {
  setCors(res);
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function main() {
  await compileBridge();
  const { send, bridge } = startBridge();

  const server = http.createServer(async (req, res) => {
    if (!req.url || !req.method) {
      sendJson(res, 400, { error: 'Invalid request' });
      return;
    }

    if (req.method === 'OPTIONS') {
      setCors(res);
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      if (req.method === 'GET' && req.url === '/api/state') {
        const state = await send('STATE');
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/init') {
        const body = await readJsonBody(req);
        const timer = Number(body.timer || 180);
        const numPlayers = Number(body.numPlayers || 2);
        const state = await send(`INIT ${timer} ${numPlayers}`);
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/cut-wire') {
        const body = await readJsonBody(req);
        const index = Number(body.index);
        const state = await send(`CUT ${index}`);
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/flip-toggle') {
        const body = await readJsonBody(req);
        const label = String(body.label || '').trim();
        const state = await send(`TOGGLE ${label}`);
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/press-button') {
        const body = await readJsonBody(req);
        const key = String(body.key || '').trim();
        const state = await send(`BUTTON ${key}`);
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/reset-password') {
        const state = await send('RESET');
        sendJson(res, 200, state);
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      sendJson(res, 500, { error: err instanceof Error ? err.message : 'Server error' });
    }
  });

  server.listen(PORT, () => {
    console.log(`Bomb backend listening on http://localhost:${PORT}`);
  });

  const shutdown = () => {
    try {
      bridge.stdin.write('QUIT\n');
      bridge.kill();
    } catch (err) {
      // no-op
    }
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
