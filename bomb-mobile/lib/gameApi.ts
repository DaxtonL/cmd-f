import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface Wire {
  id: number;
  color: string;
  cut: boolean;
}

export interface PlayerState {
  name: string;
  rules: string[];
}

export interface BackendGameState {
  timer: number;
  numPlayers: number;
  wires: Wire[];
  toggles: { [key: string]: boolean };
  buttons: { [key: string]: boolean };
  password: string[];
  rules: string[];
  players: PlayerState[];
  exploded: boolean;
  defused: boolean;
  running: boolean;
}

function resolveHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
}

const API_BASE = `http://${resolveHost()}:5050/api`;

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export const gameApi = {
  init(timer: number, numPlayers: number) {
    return apiRequest<BackendGameState>('/init', {
      method: 'POST',
      body: JSON.stringify({ timer, numPlayers }),
    });
  },

  state() {
    return apiRequest<BackendGameState>('/state', { method: 'GET' });
  },

  cutWire(index: number) {
    return apiRequest<BackendGameState>('/cut-wire', {
      method: 'POST',
      body: JSON.stringify({ index }),
    });
  },

  flipToggle(label: string) {
    return apiRequest<BackendGameState>('/flip-toggle', {
      method: 'POST',
      body: JSON.stringify({ label }),
    });
  },

  pressButton(key: string) {
    return apiRequest<BackendGameState>('/press-button', {
      method: 'POST',
      body: JSON.stringify({ key }),
    });
  },

  resetPassword() {
    return apiRequest<BackendGameState>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
};
