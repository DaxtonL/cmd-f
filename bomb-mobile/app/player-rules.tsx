import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGame } from '../contexts/GameContext';

const PLAYER_COLORS = ['#c96cab', '#eecf31', '#8a72c7', '#9ab40a', '#49a4a1', '#d07c49'];

export default function PlayerRulesScreen() {
  const router = useRouter();
  const { gameState } = useGame();

  const totalPlayers = Math.max(1, gameState.players.length || gameState.numPlayers || 1);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const activePlayer = gameState.players[playerIndex] ?? {
    name: `Player ${playerIndex + 1}`,
    rules: ['No rule assigned'],
  };

  const cardColor = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
  const isLastPlayer = playerIndex >= totalPlayers - 1;

  const handleNextPlayer = () => {
    setRevealed(false);
    if (isLastPlayer) {
      router.push('/game');
      return;
    }
    setPlayerIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSmall}>hello</Text>
          <Text style={styles.headerBig}>player {playerIndex + 1}</Text>
        </View>
        <Ionicons name="person-circle-outline" size={38} color="#ececec" />
      </View>

      <Pressable
        style={[styles.ruleCard, { backgroundColor: cardColor }]}
        onPressIn={() => setRevealed(true)}
        onPressOut={() => setRevealed(false)}
      >
        <Text style={styles.cardTitle}>{"YOU'RE ALONE IN A ROOM WITH A BOMB."}</Text>

        {revealed ? (
          <ScrollView style={styles.rulesWrap}>
            {activePlayer.rules.map((rule, idx) => (
              <Text key={`${activePlayer.name}-${idx}`} style={styles.ruleText}>
                {idx + 1}. {rule}
              </Text>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.cardBody}>Play your part in helping defuse it.</Text>
        )}

        <Text style={styles.holdText}>{revealed ? 'RELEASE TO HIDE' : 'HOLD TO REVEAL'}</Text>
      </Pressable>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPlayer}>
        <Text style={styles.nextButtonText}>{isLastPlayer ? 'START BOMB' : 'NEXT PLAYER'}</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>
        {playerIndex + 1} / {totalPlayers}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3f3f42',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSmall: {
    color: '#f2f2f2',
    fontSize: 38,
    fontWeight: '300',
    lineHeight: 40,
  },
  headerBig: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '700',
    lineHeight: 46,
  },
  ruleCard: {
    borderRadius: 14,
    minHeight: 330,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardTitle: {
    textAlign: 'center',
    color: '#222',
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 28,
    marginTop: 10,
  },
  cardBody: {
    textAlign: 'center',
    color: '#222',
    fontSize: 26,
    lineHeight: 32,
    marginTop: 24,
  },
  rulesWrap: {
    marginTop: 18,
    maxHeight: 160,
  },
  ruleText: {
    color: '#1b1b1b',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
    fontWeight: '600',
  },
  holdText: {
    textAlign: 'center',
    color: '#1f1f1f',
    fontWeight: '800',
    fontSize: 16,
    marginTop: 18,
  },
  nextButton: {
    backgroundColor: '#cf3530',
    borderRadius: 11,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  counterText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#ddd',
    fontSize: 15,
    fontWeight: '600',
  },
});
