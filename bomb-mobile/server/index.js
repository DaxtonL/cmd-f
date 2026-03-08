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
  res.type('json').send({
    message: 'Bomb-mobile backend running. Use POST /init to create a game, then GET /state. Available endpoints: /init, /state, /cutWire, /flipToggle, /pressButton, /resetPassword, /generateAssign'
  });
});

// New endpoint: create a bomb with params (6,3,4), generate a solution, and assign one rule per player
app.post('/generateAssign', (req, res) => {
  if (!state) return res.status(400).json({ error: 'Game not initialized' });

  // create bomb field with parameters 6,3,4
  state.bomb = {
    a: 6,
    b: 3,
    c: 4,
    createdAt: Date.now(),
  };

  // generate a simple solution based on the bomb - replace with more complex logic if needed
  // solutionParts simulates solution.getRules()
  const solutionParts = Array.from({ length: Math.max(1, state.numPlayers) }, (_, i) => {
    // Example generation logic: create rule text using bomb fields and index
    return `Step ${i + 1}: For bomb(${state.bomb.a},${state.bomb.b},${state.bomb.c}) do action ${i + 1}`;
  });

  // store solution in state
  state.solution = {
    generatedAt: Date.now(),
    parts: solutionParts,
  };

  // assign one part of the solution to each player (overwrite players' rules with single-item arrays)
  state.players = (state.players || Array.from({ length: state.numPlayers }, (_, i) => ({ name: `Player ${i+1}`, rules: [] })))
    .map((p, i) => {
      const assigned = solutionParts[i] || '';
      return {
        ...p,
        rules: assigned ? [assigned] : [],
      };
    });

  return res.json(state);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server listening on http://0.0.0.0:${port}`);
});
