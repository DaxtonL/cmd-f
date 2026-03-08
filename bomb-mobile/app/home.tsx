import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useGame } from '../contexts/GameContext';

export default function HomeScreen() {
  const router = useRouter();
  const { initGame } = useGame();
  const [gameMode, setGameMode] = useState<'classic' | 'online'>('classic');
  const [numPlayers, setNumPlayers] = useState(2);
  const [hardMode, setHardMode] = useState(false);

  const handleStartGame = async () => {
    const timer = hardMode ? 120 : 180;
    try {
      await initGame(timer, numPlayers, gameMode);
      router.push('/game');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to start game');
    }
  };

  const decrementPlayers = () => {
    setNumPlayers((prev) => Math.max(2, prev - 1));
  };

  const incrementPlayers = () => {
    setNumPlayers((prev) => Math.min(10, prev + 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/smile.png')}
          style={styles.smileImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME MODE</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.modeButton, gameMode === 'classic' && styles.modeButtonActive]}
              onPress={() => setGameMode('classic')}
            >
              <Text style={[styles.modeButtonText, gameMode === 'classic' && styles.modeButtonTextActive]}>
                Classic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, gameMode === 'online' && styles.modeButtonActive]}
              onPress={() => setGameMode('online')}
            >
              <Text style={[styles.modeButtonText, gameMode === 'online' && styles.modeButtonTextActive]}>
                Online
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PLAYERS</Text>
          <View style={styles.playerCounter}>
            <TouchableOpacity style={styles.counterButton} onPress={decrementPlayers}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.playerCount}>
              {numPlayers} PLAYER{numPlayers > 1 ? 'S' : ''}
            </Text>
            <TouchableOpacity style={styles.counterButton} onPress={incrementPlayers}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.timeHeader}>
            <Text style={styles.sectionTitle}>MODE</Text>
            <TouchableOpacity
              style={[styles.toggle, hardMode && styles.toggleActive]}
              onPress={() => setHardMode(!hardMode)}
            >
              <View style={[styles.toggleCircle, hardMode && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>{hardMode ? 'HARD' : 'EASY'}</Text>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A4A4A',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 0,
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    marginBottom: -40,
  },
  smileImage: {
    width: 550,
    height: 300,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#D0D0D0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#C85A54',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  playerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#666',
  },
  playerCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 15,
    color: '#333',
    marginTop: 5,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D0D0D0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#C85A54',
    alignItems: 'flex-end',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleCircleActive: {},
  bottomButtons: {
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#C85A54',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
