import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';

export default function PlayerRulesScreen() {
  const router = useRouter();
  const { gameState } = useGame();
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const cardColors = useMemo(() => {
    const colors = ['#C77FB5', '#F4D35E', '#83C5BE', '#EE6C4D', '#A8DADC', '#E07A5F'];
    return Array.from({ length: gameState.numPlayers }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );
  }, [gameState.numPlayers]);

  const handlePressIn = () => {
    setIsRevealed(true);
    Animated.spring(flipAnim, {
      toValue: 180,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsRevealed(false);
    Animated.spring(flipAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    if (currentPlayer < gameState.numPlayers - 1) {
      setCurrentPlayer(currentPlayer + 1);
      setIsRevealed(false);
      flipAnim.setValue(0);
    } else {
      router.push('/game');
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const player = gameState.players[currentPlayer];
  const cardColor = cardColors[currentPlayer];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>hello</Text>
        <Text style={styles.playerName}>player {currentPlayer + 1}</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.card}
        >
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              { backgroundColor: cardColor, transform: [{ rotateY: frontInterpolate }] },
            ]}
          >
            <Text style={styles.cardTitle}>YOU'RE {"\n"}IN A ROOM WITH A{"\n"}BOMB.</Text>
            <Text style={styles.cardSubtitle}>Play your part in helping{"\n"}defuse it.</Text>
            <Image 
              source={require('@/assets/images/HOLD TO REVEAL.png')}
              style={styles.handIcon}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              { backgroundColor: cardColor, transform: [{ rotateY: backInterpolate }] },
            ]}
          >
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>YOUR RULES:</Text>
              {player?.rules.map((rule, index) => (
                <Text key={index} style={styles.ruleText}>
                  {index + 1}. {rule}
                </Text>
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          ▶  {currentPlayer < gameState.numPlayers - 1 ? 'NEXT PLAYER' : 'START GAME'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    padding: 20,
  },
  header: {
    paddingTop: 40,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '400',
  },
  playerName: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 400,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  handIcon: {
    width: 120,
    height: 120,
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  rulesContainer: {
    width: '100%',
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  ruleText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: '#C85A54',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
