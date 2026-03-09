import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/home')}
      activeOpacity={1}
    >
      <View style={styles.redCircle} />
      
      <View style={styles.catContainer}>
        <Image 
          source={require('@/assets/images/avatar.png')}
          style={styles.catImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{"don't"}</Text>
        <Text style={styles.subtitle}>explode...</Text>
      </View>

      <Animated.Text style={[styles.tapText, { opacity: fadeAnim }]}>
        TAP TO START
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redCircle: {
    position: 'absolute',
    top: 80,
    left: -80,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#B84A47',
  },
  catContainer: {
    marginTop: -50,
    marginLeft: 20,
    zIndex: 10,
  },
  catImage: {
    width: 420,
    height: 420,
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 40,
  },
  title: {
    fontSize: 60,
    fontWeight: '700',
    color: '#fff',
    marginBottom: -10,
  },
  subtitle: {
    fontSize: 38,
    color: '#666',
    fontWeight: '300',
  },
  tapText: {
    position: 'absolute',
    bottom: 80,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
