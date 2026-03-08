import { View, Text, StyleSheet } from 'react-native';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Game Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
