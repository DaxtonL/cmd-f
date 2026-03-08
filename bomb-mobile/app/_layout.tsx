import { Stack } from 'expo-router';
import { GameProvider } from '../contexts/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="home" />
        <Stack.Screen name="game" />
      </Stack>
    </GameProvider>
  );
}
