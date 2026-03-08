import React, { createContext, useContext, useState, ReactNode } from 'react';

import { BackendGameState, gameApi, Wire } from '../lib/gameApi';

interface GameState {
  timer: number;
  numPlayers: number;
  gameMode: 'classic' | 'online';
  wires: Wire[];
  toggles: { [key: string]: boolean };
  buttons: { [key: string]: boolean };
  password: string[];
  rules: string[];
  players: { name: string; rules: string[] }[];
  exploded: boolean;
  defused: boolean;
  running: boolean;
}

export interface GameContextType {
  gameState: GameState;
  initGame: (timer: number, numPlayers: number, gameMode: 'classic' | 'online', hardMode?: boolean) => Promise<void>;
  cutWire: (index: number) => Promise<void>;
  flipToggle: (label: string) => Promise<void>;
  pressButton: (key: string) => Promise<void>;
  resetPassword: () => Promise<void>;
  generateAndAssign?: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Set this to your machine LAN IP when using Expo Go on a device, e.g. "http://192.168.1.42:3000"
const serverUrl = process.env.BACKEND_URL || 'http://localhost:3000';

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    timer: 180,
    numPlayers: 2,
    gameMode: 'classic',
    wires: [],
    toggles: {},
    buttons: {},
    password: [],
    rules: [],
    players: [],
    exploded: false,
    defused: false,
    running: false,
  });

  const initGame = async (timer: number, numPlayers: number, gameMode: 'classic' | 'online', hardMode = false) => {
    const resp = await fetch(`${serverUrl}/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timer, numPlayers, gameMode, hardMode }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Failed to initialize game backend: ${txt}`);
    }
    const json = await resp.json();
    setGameState(json);
  };

  const fetchState = async () => {
    const resp = await fetch(`${serverUrl}/state`);
    if (!resp.ok) return;
    const json = await resp.json();
    setGameState(json);
  };

  const cutWire = async (index: number) => {
    const resp = await fetch(`${serverUrl}/cutWire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });
    if (!resp.ok) return;
    const json = await resp.json();
    setGameState(json);
  };

  const flipToggle = async (label: string) => {
    const resp = await fetch(`${serverUrl}/flipToggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    });
    if (!resp.ok) return;
    const json = await resp.json();
    setGameState(json);
  };

  const pressButton = async (key: string) => {
    const resp = await fetch(`${serverUrl}/pressButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    if (!resp.ok) return;
    const json = await resp.json();
    setGameState(json);
  };

  const resetPassword = async () => {
    const resp = await fetch(`${serverUrl}/resetPassword`, {
      method: 'POST',
    });
    if (!resp.ok) return;
    const json = await resp.json();
    setGameState(json);
  };

  // create bomb(6,3,4), generate solution, assign one rule per player
  const generateAndAssign = async () => {
    const resp = await fetch(`${serverUrl}/generateAssign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`generateAssign failed: ${txt}`);
    }
    const json = await resp.json();
    setGameState(json);
  };

  return (
    <GameContext.Provider value={{ gameState, initGame, cutWire, flipToggle, pressButton, resetPassword, generateAndAssign }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
