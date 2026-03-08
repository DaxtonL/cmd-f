import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [timer, setTimer] = useState(60);
  const [wireCut, setWireCut] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [message, setMessage] = useState("Bomb UI loaded");

  function decreaseTimer() {
    setTimer((prev) => prev - 1);
    setMessage("Timer decreased");
  }

  function cutWire() {
    setWireCut(true);
    setMessage("Wire cut");
  }

  function flipToggle() {
    setToggleOn((prev) => !prev);
    setMessage("Toggle flipped");
  }

  function pressButton() {
    setButtonPressed(true);
    setMessage("Button pressed");
  }

  function resetBomb() {
    setTimer(60);
    setWireCut(false);
    setToggleOn(false);
    setButtonPressed(false);
    setMessage("Bomb reset");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dummy Bomb Screen</Text>

      <Text style={styles.text}>Timer: {timer}</Text>
      <Text style={styles.text}>Wire cut: {wireCut ? "true" : "false"}</Text>
      <Text style={styles.text}>Toggle on: {toggleOn ? "true" : "false"}</Text>
      <Text style={styles.text}>Button pressed: {buttonPressed ? "true" : "false"}</Text>
      <Text style={styles.text}>Message: {message}</Text>

      <Pressable style={styles.button} onPress={decreaseTimer}>
        <Text style={styles.buttonText}>Decrease Timer</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={cutWire}>
        <Text style={styles.buttonText}>Cut Wire</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={flipToggle}>
        <Text style={styles.buttonText}>Flip Toggle</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={pressButton}>
        <Text style={styles.buttonText}>Press Button</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={resetBomb}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  button: {
    backgroundColor: "#dddddd",
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});