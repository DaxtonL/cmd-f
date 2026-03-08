import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Wire {
  id: number;
  color: string;
  cut: boolean;
}

interface GameState {
  timer: number;
  numPlayers: number;
  gameMode: 'classic' | 'online';
  wires: Wire[];
  toggles: { [key: string]: boolean };
  buttons: { [key: string]: boolean };
  password: string[];
  rules: string[];
  players: Array<{ name: string; rules: string[] }>;
  exploded: boolean;
  defused: boolean;
  running: boolean;
}

interface GameContextType {
  gameState: GameState;
  initGame: (timer: number, numPlayers: number, gameMode: 'classic' | 'online') => void;
  cutWire: (index: number) => void;
  flipToggle: (label: string) => void;
  pressButton: (key: string) => void;
  resetPassword: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    timer: 180,
    numPlayers: 1,
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

  const initGame = (timer: number, numPlayers: number, gameMode: 'classic' | 'online') => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const wires = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      cut: false,
    }));

    const rules: string[] = [];
    for (let i = 0; i < numPlayers * 2; i++) {
      rules.push(`Rule ${i + 1} for game`);
    }

    const players = Array.from({ length: numPlayers }, (_, i) => ({
      name: `Player ${i + 1}`,
      rules: [rules[i * 2] || '', rules[i * 2 + 1] || ''],
    }));

    setGameState({
      timer,
      numPlayers,
      gameMode,
      wires,
      toggles: { explode: false, hot: false, on: false },
      buttons: { '1': false, '2': false, '3': false, '4': false },
      password: [],
      rules,
      players,
      exploded: false,
      defused: false,
      running: true,
    });
  };

  const cutWire = (index: number) => {
    setGameState(prev => ({
      ...prev,
      wires: prev.wires.map(w => w.id === index ? { ...w, cut: true } : w),
    }));
  };

  const flipToggle = (label: string) => {
    setGameState(prev => ({
      ...prev,
      toggles: { ...prev.toggles, [label]: !prev.toggles[label] },
    }));
  };

  const pressButton = (key: string) => {
    setGameState(prev => {
      if (prev.buttons[key] || prev.password.length >= 4) return prev;
      return {
        ...prev,
        password: [...prev.password, key],
        buttons: { ...prev.buttons, [key]: true },
      };
    });
  };

  const resetPassword = () => {
    setGameState(prev => ({
      ...prev,
      password: [],
      buttons: { '1': false, '2': false, '3': false, '4': false },
    }));
  };

  return (
    <GameContext.Provider value={{ gameState, initGame, cutWire, flipToggle, pressButton, resetPassword }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
