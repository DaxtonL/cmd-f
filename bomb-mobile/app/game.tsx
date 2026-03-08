import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGame } from '../contexts/GameContext';

export default function GameScreen() {
  const { gameState, cutWire, flipToggle, pressButton, resetPassword, refreshState } = useGame();

  useEffect(() => {
    refreshState().catch(() => {
      // Screen will still render existing context state if refresh fails.
    });
  }, [refreshState]);

  const statusText = gameState.defused
    ? 'DEFUSED'
    : gameState.exploded
      ? 'EXPLODED'
      : gameState.running
        ? 'RUNNING'
        : 'IDLE';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bomb Control</Text>
      <Text style={styles.subtitle}>Status: {statusText}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wires</Text>
        <View style={styles.rowWrap}>
          {gameState.wires.map((wire) => (
            <TouchableOpacity
              key={wire.id}
              style={[styles.actionButton, wire.cut && styles.actionButtonDisabled]}
              disabled={wire.cut || gameState.exploded || gameState.defused}
              onPress={() => cutWire(wire.id).catch(() => {})}
            >
              <Text style={styles.actionText}>Wire {wire.id} ({wire.color}) {wire.cut ? 'CUT' : 'CUT NOW'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toggles</Text>
        <View style={styles.rowWrap}>
          {Object.entries(gameState.toggles).map(([label, value]) => (
            <TouchableOpacity
              key={label}
              style={styles.actionButton}
              disabled={gameState.exploded || gameState.defused}
              onPress={() => flipToggle(label).catch(() => {})}
            >
              <Text style={styles.actionText}>{label}: {value ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons</Text>
        <View style={styles.rowWrap}>
          {Object.entries(gameState.buttons).map(([key, pressed]) => (
            <TouchableOpacity
              key={key}
              style={[styles.actionButton, pressed && styles.actionButtonDisabled]}
              disabled={pressed || gameState.exploded || gameState.defused}
              onPress={() => pressButton(key).catch(() => {})}
            >
              <Text style={styles.actionText}>Button {key}: {pressed ? 'PRESSED' : 'PRESS'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={() => resetPassword().catch(() => {})}>
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>
        <Text style={styles.passwordText}>Password: {gameState.password.join('') || '(empty)'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rules</Text>
        {gameState.rules.map((rule, idx) => (
          <Text key={`${rule}-${idx}`} style={styles.ruleText}>{idx + 1}. {rule}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#d4d4d4',
    fontSize: 16,
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  rowWrap: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#cc5a55',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionButtonDisabled: {
    backgroundColor: '#666666',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#5555aa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: '700',
  },
  passwordText: {
    marginTop: 8,
    color: '#f0f0f0',
  },
  ruleText: {
    color: '#f0f0f0',
    marginBottom: 4,
  },
});
