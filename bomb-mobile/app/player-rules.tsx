import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useGame } from '../contexts/GameContext';

const PLAYER_COLORS = ['#c96cab', '#eecf31', '#8a72c7', '#9ab40a', '#49a4a1', '#d07c49'];

export default function PlayerRulesScreen() {
  const router = useRouter();
  const { gameState } = useGame();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // reset to first player when game state changes (e.g. new game)
    setIndex(0);
    setRevealed(false);
  }, [gameState?.players?.length]);

  const nextPlayer = () => {
    setRevealed(false);
    const next = index + 1;
    if (next >= (gameState?.numPlayers || gameState?.players?.length || 0)) {
      // finished showing all players -> go to game board
      Alert.alert('All players seen', 'Opening game board.');
      router.push('/game'); // changed from '/' to '/game'
      return;
    }
    setIndex(next);
  };

  const player = (gameState?.players && gameState.players[index]) || { name: `Player ${index + 1}`, rules: [] };
  const assignedRule = (player.rules && player.rules[0]) || 'No rule assigned yet.';

  const cardColor = PLAYER_COLORS[index % PLAYER_COLORS.length];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerSmall}>hello</Text>
          <Text style={styles.headerBig}>{player.name}</Text>
        </View>
        <Ionicons name="person-circle-outline" size={38} color="#ececec" />
      </View>

      <Pressable
        style={[styles.card, revealed ? styles.cardRevealed : null, { backgroundColor: cardColor }]}
        onPressIn={() => setRevealed(true)}
        onPressOut={() => setRevealed(false)}
      >
        <View style={styles.cardInner}>
          {revealed ? (
            <Text style={styles.ruleText}>{assignedRule}</Text>
          ) : (
            <>
              <Text style={styles.cardTitle}>YOU'RE ALONE IN A ROOM WITH A BOMB.</Text>
              <Text style={styles.cardSubtitle}>Play your part in helping defuse it.</Text>
              <Text style={styles.hint}>HOLD TO REVEAL</Text>
            </>
          )}
        </View>
      </Pressable>

      <TouchableOpacity style={styles.nextButton} onPress={nextPlayer}>
        <Text style={styles.nextButtonText}>⏵ NEXT PLAYER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2b2b2b', padding: 20, justifyContent: 'flex-start' },
  hello: { color: '#fff', opacity: 0.9, fontSize: 20 },
  playerName: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 20 },
  card: {
    borderRadius: 14,
    minHeight: 390,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'center',
    marginVertical: 20,
  },
  cardRevealed: { backgroundColor: '#f5f5f5' },
  cardInner: { alignItems: 'center' },
  cardTitle: {
    textAlign: 'center',
    color: '#222',
    fontWeight: '800',
    fontSize: 33,
    lineHeight: 38,
    marginTop: 10,
  },
  cardSubtitle: { textAlign: 'center', color: '#666', marginBottom: 20 },
  hint: { marginTop: 10, color: '#333', fontWeight: '600' },
  ruleText: {
    color: '#1b1b1b',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  nextButton: {
    backgroundColor: '#C85A54',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: { color: '#fff', fontWeight: '700' },
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
});
