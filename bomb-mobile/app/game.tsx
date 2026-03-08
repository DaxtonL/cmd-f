import { View, StyleSheet, Image, Text, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

export default function GameScreen() {
  const { gameState, pressButton, cutWire } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(gameState.timer);
  const scaleAnims = useRef(['1', '2', '3', '4'].map(() => new Animated.Value(1))).current;
  const wireScaleAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(1))).current;

  const handlePress = (btn: string, idx: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[idx], { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[idx], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    pressButton(btn);
  };

  const handleWireCut = (idx: number) => {
    Animated.timing(wireScaleAnims[idx], { toValue: 0, duration: 200, useNativeDriver: true }).start();
    cutWire(idx);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/phone-screen.png')}
        style={styles.phoneImage}
        resizeMode="contain"
      />
      <View style={styles.timerOverlay}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {['1', '2', '3', '4'].map((btn, idx) => (
          <TouchableOpacity
            key={btn}
            onPress={() => handlePress(btn, idx)}
            disabled={gameState.buttons[btn]}
            activeOpacity={1}
          >
            <Animated.View style={[styles.button, { transform: [{ scale: scaleAnims[idx] }] }]} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wiresContainer}>
        {[0, 1, 2, 3].map((idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleWireCut(idx)}
            disabled={gameState.wires[idx]?.cut}
            activeOpacity={1}
          >
            <Animated.View style={[styles.wire, { transform: [{ scaleY: wireScaleAnims[idx] }] }]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C85A54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneImage: {
    width: '80%',
    height: '80%',
    transform: [{ rotate: '90deg' }],
  },
  timerOverlay: {
    position: 'absolute',
    top: '50%',
    left: '15%',
    transform: [{ rotate: '90deg' }, { translateY: -530 }, { translateX: 20 }],
    alignItems: 'center',
  },
  timerText: {
    fontSize: 50,
    fontWeight: '900',
    color: '#FF0000',
    fontFamily: 'Courier',
    letterSpacing: 2,
  },
  buttonsContainer: {
    position: 'absolute',
    top: '42%',
    left: '18%',
    gap: 8,
  },
  button: {
    width: 50,
    height: 50,
  },
  wiresContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '50%',
    transform: [{ translateX: -60 }],
    flexDirection: 'row',
    gap: 15,
  },
  wire: {
    width: 10,
    height: 100,
  },
});
