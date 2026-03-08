#include "bomb.h"

// creates a new bomb
// takes in a list of colors, labels, and keys for elements
// and a map of "facts"
bomb::bomb() {
    wires = {};
    toggles = {};
    buttons = {};
    password = {};
    facts = {};
}
bomb::bomb(int numWires, int numToggles, int numButtons) {
    for (int i = 0; i < numWires; i++) {
        wire w;
        w.setColor(colors[i]);
        wires.push_back(w);
    }

    for (int i = 0; i < numToggles; i++) {
        toggles[labels[i]] = false;
    }

    for (int i = 0; i < numButtons; i++) {
        buttons[keys[i]] = false;
    }
}

// if the wire is not cut, cut it
// returns true if there is a wire to cuts
bool bomb::cutWire(int n) {
    if (n < wires.size()) {
        wires[n].cutWire();
        return true;
    }
    return false;
}

// switches value of toggle if it exists
void bomb::flipToggle(string label) {
    if (toggles.find(label) != toggles.end()) {
        toggles[label] = !toggles[label];
    }
}

// if the button has not been pressed yet, add its key to the "password" and set it to pressed
void bomb::pressButton(string key) {
    if (buttons.find(key) != buttons.end()) {
        if (buttons[key] == false) {
            password.push_back(key);
            buttons[key] = true;
        }
    }
}

vector<wire> bomb::getWires() {
    return wires;
}

map<string, bool> bomb::getToggles() {
    return toggles;
}

map<string, bool> bomb::getButtons() {
    return buttons;
}

vector<string> bomb::getPassword() {
    return password;
}

void bomb::resetButtons() {
    for (auto& pair : buttons) {
        pair.second = false;
    }
    password.clear();
}

bool bomb::compareWires(vector<bool> solution) {
    for (int i = 0; i < solution.size(); i++) {
        if (wires[i].getIscut() != solution[i]) {
            return false;
        }
    }
    return true;
}