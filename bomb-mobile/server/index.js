const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'white', 'black'];

let state = null;

// Helper: create a bomb object with getters (a, b, c are numeric parameters)
function createBomb(a = 6, b = 3, c = 4) {
  // internal representation
  const wires = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cut: false,
  }));

  const toggles = { A: false, B: false, C: false }; // 3 toggles
  const buttons = { '1': false, '2': false, '3': false, '4': false }; // 4 buttons

  // provide getter-style access for server-side logic
  const bomb = {
    a, b, c,
    wires,
    toggles,
    buttons,
    getNumWires() { return this.wires.length; },
    getNumToggles() { return Object.keys(this.toggles).length; },
    getNumButtons() { return Object.keys(this.buttons).length; },
    getA() { return this.a; },
    getB() { return this.b; },
    getC() { return this.c; },
  };

  return bomb;
}

// Simple solution generator that "uses getters" from bomb to produce rules
function generateSolutionForBomb(bomb) {
  // simulate more complex logic by reading bomb getters
  const a = bomb.getA();
  const b = bomb.getB();
  const c = bomb.getC();
  const nWires = bomb.getNumWires();
  const nToggles = bomb.getNumToggles();
  const nButtons = bomb.getNumButtons();

  // Create a list of textual rules that reference bomb fields
  const rules = [];

  // rule examples - keep deterministic-ish but varied
  rules.push(`Cut the ${bomb.wires[0]?.color || 'first'} wire if A=${a}`);
  rules.push(`Press button 1 if B=${b}`);
  rules.push(`Flip toggle A ${a % 2 === 0 ? 'ON' : 'OFF'}`);
  rules.push(`Do not press button 4 if C=${c}`);
  rules.push(`Cut the ${bomb.wires[nWires - 1]?.color || 'last'} wire`);
  rules.push(`If toggles B+C are false, press button 2`);
  // Add more filler rules up to a reasonable number
  for (let i = rules.length; i < Math.max(6, nWires); i++) {
    rules.push(`Step ${i + 1}: check bomb fields a=${a},b=${b},c=${c}`);
  }

  // Return object that mimics a solution module with getters
  return {
    generatedAt: Date.now(),
    getSolution() { return this; },
    getRules() { return rules; },
    rules,
  };
}

function makeGame(timer = 180, numPlayers = 2, gameMode = 'classic') {
  const wires = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cut: false,
  }));

  const toggles = { A: false, B: false, C: false }; // 3 toggles
  const buttons = { '1': false, '2': false, '3': false, '4': false }; // 4 buttons

  const rules = Array.from({ length: numPlayers * 2 }, (_, i) => `Rule ${i + 1}`);
  const players = Array.from({ length: numPlayers }, (_, i) => ({
    name: `Player ${i + 1}`,
    rules: [], // will be filled by generateAssign
  }));
  return {
    timer,
    numPlayers,
    gameMode,
    hardMode: false,
    wires,
    toggles,
    buttons,
    password: [],
    rules,
    players,
    exploded: false,
    defused: false,
    running: true,
    // placeholders for bomb/solution
    bomb: null,
    solution: null,
  };
}

app.get('/', (req, res) => {
  res.type('json').send({
    message:
      'Bomb-mobile backend running. Use POST /init to create a game, then GET /state. Available endpoints: /init, /state, /cutWire, /flipToggle, /pressButton, /resetPassword, /generateAssign',
  });
});

app.post('/init', (req, res) => {
  const { timer = 180, numPlayers = 2, gameMode = 'classic', hardMode = false } = req.body || {};
  state = makeGame(timer, numPlayers, gameMode);
  state.hardMode = !!hardMode;
  res.json(state);
});

app.get('/state', (req, res) => {
  if (!state) return res.status(400).json({ error: 'Game not initialized' });
  res.json(state);
});

app.post('/cutWire', (req, res) => {
  const { index } = req.body || {};
  if (!state) return res.status(400).json({ error: 'Game not initialized' });
  const idx = Number(index);
  if (Number.isInteger(idx) && idx >= 0 && idx < state.wires.length) {
    state.wires[idx].cut = true;
    return res.json(state);
  }
  return res.status(400).json({ error: 'invalid index' });
});

app.post('/flipToggle', (req, res) => {
  const { label } = req.body || {};
  if (!state) return res.status(400).json({ error: 'Game not initialized' });
  if (label in state.toggles) {
    state.toggles[label] = !state.toggles[label];
    return res.json(state);
  }
  return res.status(400).json({ error: 'invalid toggle' });
});

app.post('/pressButton', (req, res) => {
  const { key } = req.body || {};
  if (!state) return res.status(400).json({ error: 'Game not initialized' });
  if (!(key in state.buttons)) return res.status(400).json({ error: 'invalid button' });
  if (!state.buttons[key] && state.password.length < 8) {
    state.password.push(key);
    state.buttons[key] = true;
  }
  return res.json(state);
});

app.post('/resetPassword', (req, res) => {
  if (!state) return res.status(400).json({ error: 'Game not initialized' });
  state.password = [];
  Object.keys(state.buttons).forEach((k) => (state.buttons[k] = false));
  return res.json(state);
});

// New endpoint: create a bomb with params (6,3,4), generate a solution, and assign one rule per player
app.post('/generateAssign', (req, res) => {
  if (!state) return res.status(400).json({ error: 'Game not initialized' });

  // create bomb field with parameters 6,3,4 (user requested values)
  const bomb = createBomb(6, 3, 4);
  state.bomb = {
    // serialize bomb metadata for client inspection
    a: bomb.a,
    b: bomb.b,
    c: bomb.c,
    numWires: bomb.getNumWires(),
    numToggles: bomb.getNumToggles(),
    numButtons: bomb.getNumButtons(),
    wires: bomb.wires.map(w => ({ id: w.id, color: w.color, cut: w.cut })),
    toggles: { ...bomb.toggles },
    buttons: { ...bomb.buttons },
    createdAt: Date.now(),
  };

  // generate solution server-side using bomb getters
  const solution = generateSolutionForBomb(bomb);
  state.solution = {
    generatedAt: solution.generatedAt,
    rules: solution.getRules(),
  };

  // assign one part of the solution to each player
  state.players = (state.players || Array.from({ length: state.numPlayers }, (_, i) => ({ name: `Player ${i + 1}`, rules: [] }))).map((p, i) => {
    const assigned = state.solution.rules[i] || '';
    return {
      ...p,
      rules: assigned ? [assigned] : [],
    };
  });

  // Also reflect the bomb/solution in top-level state for client
  state.wires = state.bomb.wires;
  state.toggles = state.bomb.toggles;
  state.buttons = state.bomb.buttons;

  return res.json(state);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server listening on http://0.0.0.0:${port}`);
});
