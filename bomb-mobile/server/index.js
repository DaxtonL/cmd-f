const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

let state = null;

function makeGame(timer = 180, numPlayers = 2, gameMode = 'classic') {
  const wires = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cut: false,
  }));

  const toggles = { A: false, B: false, C: false };
  const buttons = { '1': false, '2': false, '3': false, '4': false };
  const rules = Array.from({ length: numPlayers * 2 }, (_, i) => `Rule ${i + 1}`);
  const players = Array.from({ length: numPlayers }, (_, i) => ({
    name: `Player ${i + 1}`,
    rules: [rules[i * 2] || '', rules[i * 2 + 1] || ''],
  }));

  return {
    timer,
    numPlayers,
    gameMode,
    wires,
    toggles,
    buttons,
    password: [],
    rules,
    players,
    exploded: false,
    defused: false,
    running: true,
  };
}

function ensureState(res) {
  if (!state) {
    res.status(400).json({ error: 'Game not initialized. Call POST /init first.' });
    return false;
  }
  return true;
}

app.post(['/init', '/api/init'], (req, res) => {
  const { timer = 180, numPlayers = 2, gameMode = 'classic', hardMode = false } = req.body || {};
  state = makeGame(timer, numPlayers, gameMode);
  state.hardMode = !!hardMode;
  res.json(state);
});

app.get(['/state', '/api/state'], (req, res) => {
  if (!ensureState(res)) return;
  res.json(state);
});

app.post(['/cutWire', '/api/cut-wire'], (req, res) => {
  if (!ensureState(res)) return;

  const idx = Number(req.body?.index);
  if (Number.isInteger(idx) && idx >= 0 && idx < state.wires.length) {
    state.wires[idx].cut = true;
    return res.json(state);
  }

  return res.status(400).json({ error: 'Invalid wire index' });
});

app.post(['/flipToggle', '/api/flip-toggle'], (req, res) => {
  if (!ensureState(res)) return;

  const label = String(req.body?.label || '').trim();
  if (label in state.toggles) {
    state.toggles[label] = !state.toggles[label];
    return res.json(state);
  }

  return res.status(400).json({ error: 'Invalid toggle label' });
});

app.post(['/pressButton', '/api/press-button'], (req, res) => {
  if (!ensureState(res)) return;

  const key = String(req.body?.key || '').trim();
  if (!(key in state.buttons)) {
    return res.status(400).json({ error: 'Invalid button key' });
  }

  if (!state.buttons[key] && state.password.length < 4) {
    state.password.push(key);
    state.buttons[key] = true;
  }

  return res.json(state);
});

app.post(['/resetPassword', '/api/reset-password'], (req, res) => {
  if (!ensureState(res)) return;

  state.password = [];
  Object.keys(state.buttons).forEach((k) => {
    state.buttons[k] = false;
  });

  return res.json(state);
});

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bomb Backend Tester</title>
  <style>
    body { font-family: sans-serif; margin: 20px; background: #1f1f1f; color: #f0f0f0; }
    button { margin: 4px; padding: 8px 12px; }
    .row { margin-bottom: 10px; }
    pre { background: #111; padding: 12px; border-radius: 8px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Bomb Backend Tester</h1>
  <div class="row">
    <button onclick="initGame()">Init Game</button>
    <button onclick="fetchState()">Get State</button>
    <button onclick="resetPassword()">Reset Password</button>
  </div>
  <div class="row">
    <button onclick="cutWire(0)">Cut Wire 0</button>
    <button onclick="cutWire(1)">Cut Wire 1</button>
    <button onclick="cutWire(2)">Cut Wire 2</button>
    <button onclick="cutWire(3)">Cut Wire 3</button>
  </div>
  <div class="row">
    <button onclick="flipToggle('A')">Flip A</button>
    <button onclick="flipToggle('B')">Flip B</button>
    <button onclick="flipToggle('C')">Flip C</button>
  </div>
  <div class="row">
    <button onclick="pressButton('1')">Press 1</button>
    <button onclick="pressButton('2')">Press 2</button>
    <button onclick="pressButton('3')">Press 3</button>
    <button onclick="pressButton('4')">Press 4</button>
  </div>
  <pre id="out">Click Init Game to start.</pre>

  <script>
    async function call(path, body) {
      const res = await fetch(path, {
        method: body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      document.getElementById('out').textContent = JSON.stringify(json, null, 2);
    }

    function initGame() { return call('/init', { timer: 180, numPlayers: 2, gameMode: 'classic' }); }
    function fetchState() { return call('/state'); }
    function cutWire(index) { return call('/cutWire', { index }); }
    function flipToggle(label) { return call('/flipToggle', { label }); }
    function pressButton(key) { return call('/pressButton', { key }); }
    function resetPassword() { return call('/resetPassword', {}); }
  </script>
</body>
</html>`);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server listening on http://0.0.0.0:${port}`);
});
