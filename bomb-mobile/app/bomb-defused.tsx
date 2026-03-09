import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function BombDefused() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>BOMB DEFUSED</Text>
        <Text style={styles.subtitle}>Nice work. You saved everyone.</Text>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f0f' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#70d27b', fontSize: 42, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  subtitle: { color: '#fff', fontSize: 18, marginBottom: 24, textAlign: 'center' },
  homeBtn: {
    backgroundColor: '#C85A54',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  homeBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
