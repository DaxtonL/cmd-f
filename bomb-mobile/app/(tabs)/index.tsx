import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from "react-native";

type Player = {
  id: number;
  name: string;
};

export default function HomeScreen() {
  const [timer, setTimer] = useState(60);
  const [wireCut, setWireCut] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [message, setMessage] = useState("Bomb UI loaded");

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");

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

  function addPlayer() {
    const trimmed = playerName.trim();

    if (trimmed.length === 0) {
      setMessage("Enter a player name first");
      return;
    }

    const newPlayer: Player = {
      id: Date.now(),
      name: trimmed,
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setPlayerName("");
    setMessage(`Added player: ${trimmed}`);
  }

  function removePlayer(id: number) {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    setMessage("Player removed");
  }

  function resetBomb() {
    setTimer(60);
    setWireCut(false);
    setToggleOn(false);
    setButtonPressed(false);
    setPlayers([]);
    setPlayerName("");
    setMessage("Bomb reset");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dummy Bomb Screen</Text>

      <Text style={styles.text}>Timer: {timer}</Text>
      <Text style={styles.text}>Wire cut: {wireCut ? "true" : "false"}</Text>
      <Text style={styles.text}>Toggle on: {toggleOn ? "true" : "false"}</Text>
      <Text style={styles.text}>Button pressed: {buttonPressed ? "true" : "false"}</Text>
      <Text style={styles.text}>Message: {message}</Text>

      <Text style={styles.sectionTitle}>Players</Text>

      <TextInput
        value={playerName}
        onChangeText={setPlayerName}
        placeholder="Enter player name"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={addPlayer}>
        <Text style={styles.buttonText}>Add Player</Text>
      </Pressable>

      <Text style={styles.text}>Player count: {players.length}</Text>

      {players.map((player, index) => (
        <View key={player.id} style={styles.playerRow}>
          <Text style={styles.text}>
            {index + 1}. {player.name}
          </Text>
          <Pressable style={styles.smallButton} onPress={() => removePlayer(player.id)}>
            <Text style={styles.buttonText}>Remove</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Bomb Controls</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "white",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#dddddd",
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 8,
  },
  smallButton: {
    backgroundColor: "#dddddd",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  playerRow: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});