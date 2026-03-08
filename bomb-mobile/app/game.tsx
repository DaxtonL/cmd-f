import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../contexts/GameContext';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, cutWire, flipToggle, pressButton, resetPassword, remainingTime, totalTime } = useGame();

  useEffect(() => {
    // if no game running, go back to home
    if (!gameState?.running) {
      setTimeout(() => router.push('/'), 400);
    }
  }, [gameState?.running]);

  const wires = gameState?.wires || [];
  const toggles = gameState?.toggles || {};
  const buttons = gameState?.buttons || {};
  const password = gameState?.password || [];

  const handleCutWire = async (i: number) => {
    try { await cutWire(i); } catch (err) { Alert.alert('Error', (err as Error)?.message || 'Failed to cut wire'); }
  };
  const handleFlipToggle = async (label: string) => {
    try { await flipToggle(label); } catch (err) { Alert.alert('Error', (err as Error)?.message || 'Failed to flip toggle'); }
  };
  const handlePressButton = async (key: string) => {
    try { await pressButton(key); } catch (err) { Alert.alert('Error', (err as Error)?.message || 'Failed to press button'); }
  };

  // format mm:ss
  const mmss = () => {
    const s = Math.max(0, remainingTime || 0);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bomb Console</Text>

      {/* Numeric timer display */}
      <View style={styles.timerRow}>
        <Text style={styles.bigTimer}>{mmss()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wires</Text>
        <FlatList
          horizontal
          data={wires}
          keyExtractor={(w) => String(w.id)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.wire,
                item.cut ? styles.wireCut : styles.wireLive,
                { marginLeft: index === 0 ? 0 : 12 },
              ]}
              onPress={() => handleCutWire(index)}
            >
              <Text style={styles.wireText}>{item.cut ? 'CUT' : item.color?.toUpperCase() || `W${index}`}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toggles</Text>
        <View style={styles.row}>
          {Object.keys(toggles).length === 0 && <Text style={styles.note}>No toggles</Text>}
          {Object.keys(toggles).map((k) => {
            const on = toggles[k];
            return (
              <TouchableOpacity
                key={k}
                style={[styles.toggle, on ? styles.toggleOn : styles.toggleOff]}
                onPress={() => handleFlipToggle(k)}
              >
                <Text style={[styles.toggleLabel, on ? styles.toggleLabelOn : null]}>{k}</Text>
                <Text style={styles.toggleState}>{on ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons (enter code)</Text>
        <View style={styles.keypad}>
          {['1','2','3','4'].map((k) => (
            <TouchableOpacity
              key={k}
              style={[styles.key, buttons[k] ? styles.keyPressed : styles.keyIdle]}
              onPress={() => handlePressButton(k)}
            >
              <Text style={[styles.keyText, buttons[k] ? styles.keyTextPressed : null]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <Text style={styles.note}>Password: {password.join('')}</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={resetPassword}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
          <Text style={styles.backText}>← HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const RED = '#C85A54';
const BLACK = '#111';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1b1b1b', padding: 18 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },

  timerRow: { marginBottom: 16, alignItems: 'center' },
  bigTimer: { color: '#fff', fontSize: 48, fontWeight: '800' },

  section: { marginBottom: 18, backgroundColor: '#161616', padding: 12, borderRadius: 12 },
  sectionTitle: { color: '#ddd', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  note: { color: '#bbb', marginRight: 12 },

  wire: {
    width: 90,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: BLACK,
  },
  wireLive: { backgroundColor: RED },
  wireCut: { backgroundColor: '#444' },
  wireText: { color: '#fff', fontWeight: '700' },

  toggle: {
    width: 120,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BLACK,
  },
  toggleOn: { backgroundColor: RED },
  toggleOff: { backgroundColor: '#333' },
  toggleLabel: { color: '#fff', fontWeight: '700' },
  toggleLabelOn: { color: BLACK },
  toggleState: { color: '#fff', marginTop: 4 },

  keypad: { flexDirection: 'row', flexWrap: 'wrap' },
  key: {
    width: 70,
    height: 60,
    borderRadius: 10,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BLACK,
  },
  keyIdle: { backgroundColor: '#111' },
  keyPressed: { backgroundColor: RED },
  keyText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  keyTextPressed: { color: BLACK },

  resetBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: RED,
    borderRadius: 8,
  },
  resetText: { color: '#fff', fontWeight: '700' },

  footer: { marginTop: 10, alignItems: 'flex-start' },
  backBtn: { padding: 10 },
  backText: { color: RED, fontWeight: '700' },
});
