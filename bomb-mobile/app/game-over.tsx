import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function GameOver() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>GAME OVER</Text>
        <Text style={styles.subtitle}>The bomb detonated.</Text>

        <View style={styles.detailsBox}>
          <Text style={styles.details}>You can review the game or start a new one.</Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => {
            router.push('/');
          }}
          accessibilityLabel="Back to Home"
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f0f' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#ff4d4d', fontSize: 44, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  subtitle: { color: '#fff', fontSize: 18, marginBottom: 20 },
  detailsBox: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    width: '100%',
    alignItems: 'center',
  },
  details: { color: '#ddd', textAlign: 'center' },
  homeBtn: {
    backgroundColor: '#C85A54',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  homeBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
