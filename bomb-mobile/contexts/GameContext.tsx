import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

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

interface GameContextType {
  gameState: GameState;
  initGame: (timer: number, numPlayers: number, gameMode: 'classic' | 'online') => Promise<void>;
  cutWire: (index: number) => Promise<void>;
  flipToggle: (label: string) => Promise<void>;
  pressButton: (key: string) => Promise<void>;
  resetPassword: () => Promise<void>;
  refreshState: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function toGameState(prev: GameState, backend: BackendGameState): GameState {
  return {
    ...prev,
    timer: backend.timer,
    numPlayers: backend.numPlayers,
    wires: backend.wires,
    toggles: backend.toggles,
    buttons: backend.buttons,
    password: backend.password,
    rules: backend.rules,
    players: backend.players,
    exploded: backend.exploded,
    defused: backend.defused,
    running: backend.running,
  };
}

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

  const initGame = useCallback(async (timer: number, numPlayers: number, gameMode: 'classic' | 'online') => {
    const backend = await gameApi.init(timer, numPlayers);
    setGameState((prev) => ({
      ...toGameState(prev, backend),
      gameMode,
    }));
  }, []);

  const refreshState = useCallback(async () => {
    const backend = await gameApi.state();
    setGameState((prev) => toGameState(prev, backend));
  }, []);

  const cutWire = useCallback(async (index: number) => {
    const backend = await gameApi.cutWire(index);
    setGameState((prev) => toGameState(prev, backend));
  }, []);

  const flipToggle = useCallback(async (label: string) => {
    const backend = await gameApi.flipToggle(label);
    setGameState((prev) => toGameState(prev, backend));
  }, []);

  const pressButton = useCallback(async (key: string) => {
    const backend = await gameApi.pressButton(key);
    setGameState((prev) => toGameState(prev, backend));
  }, []);

  const resetPassword = useCallback(async () => {
    const backend = await gameApi.resetPassword();
    setGameState((prev) => toGameState(prev, backend));
  }, []);

  return (
    <GameContext.Provider value={{ gameState, initGame, cutWire, flipToggle, pressButton, resetPassword, refreshState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
