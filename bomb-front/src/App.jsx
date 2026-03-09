import { useState } from "react";

export default function App() {
  // dummy frontend state
  const [timer, setTimer] = useState(60);
  const [wireCut, setWireCut] = useState(false);
  const [toggleOn, setToggleOn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [message, setMessage] = useState("Frontend loaded");

  function testTimerDown() {
    setTimer((prev) => prev - 1);
    setMessage("Timer decreased");
  }

  function testCutWire() {
    setWireCut(true);
    setMessage("Wire was cut");
  }

  function testFlipToggle() {
    setToggleOn((prev) => !prev);
    setMessage("Toggle flipped");
  }

  function testPressButton() {
    setButtonPressed(true);
    setMessage("Button pressed");
  }

  function resetAll() {
    setTimer(60);
    setWireCut(false);
    setToggleOn(false);
    setButtonPressed(false);
    setMessage("Reset complete");
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Test Bomb</h1>

      <p>Timer: {timer}</p>
      <p>Wire cut: {wireCut ? "true" : "false"}</p>
      <p>Toggle on: {toggleOn ? "true" : "false"}</p>
      <p>Button pressed: {buttonPressed ? "true" : "false"}</p>
      <p>Message: {message}</p>

      <button onClick={testTimerDown}>Decrease Timer</button>
      <br /><br />

      <button onClick={testCutWire}>Cut Wire</button>
      <br /><br />

      <button onClick={testFlipToggle}>Flip Toggle</button>
      <br /><br />

      <button onClick={testPressButton}>Press Button</button>
      <br /><br />

      <button onClick={resetAll}>Reset</button>
    </div>
  );
}