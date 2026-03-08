#include <vector>
#include <string>
#include <map>
#include "wire.cpp"
using namespace std;


class bomb{
    public:
        // creates a new bomb
        // takes in a list of colors, labels, and keys for elements
        // and a map of "facts"
        bomb(vector<string> colors, vector<string> labels, vector<string> keys, map<string, bool> facts_) {
            for (int i = 0; i < colors.size(); i++) {
                wire w;
                w.setColor(colors[i]);
                wires.push_back(w);
            }

            for (int i = 0; i < labels.size(); i++) {
                toggles[labels[i]] = false;
            }

            for (int i = 0; i < keys.size(); i++) {
                buttons[keys[i]] = false;
            }

            facts = facts_;
        }

        // if the wire is not cut, cut it
        // returns true if there is a wire to cuts
        bool cutWire(int n) {
            if (n < wires.size()) {
                wires[n].cutWire();
                return true;
            }
            return false;
        }

        // switches value of toggle if it exists
        void flipToggle(string label) {
            if (toggles.find(label) != toggles.end()) {
                toggles[label] = !toggles[label];
            }
        }

        // if the button has not been pressed yet, add its key to the "password" and set it to pressed
        void pressButton(string key) {
            if (buttons.find(key) != buttons.end()) {
                if (buttons[key] == false) {
                    password.push_back(key);
                    buttons[key] = true;
                }
            }
        }

        vector<wire> getWires() {
            return wires;
        }

        map<string, bool> getToggles() {
            return toggles;
        }
        
        map<string, bool> getButtons() {
            return buttons;
        }

        vector<string> getPassword() {
            return password;
        }

        void resetButtons() {
            for (auto& pair : buttons) {
                pair.second = false;
            }
            password.clear();
        }

        bool compareWires(vector<bool> solution) {
            for (int i = 0; i < solution.size(); i++) {
                if (wires[i].getIscut() != solution[i]) {
                    return false;
                }
            }
            return true;
        }

    private:
        vector<wire> wires;
        map<string, bool> toggles;      
        map<string, bool> buttons;      // true = pressed
        map<string, bool> facts;
        vector<string> password;
};