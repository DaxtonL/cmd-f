#include <iostream>
#include <vector>
#include <string>
#include <map>
#include "bomb.cpp"
using namespace std;

void printInfo(bomb b) {
    map<string, bool> wires = b.getWires();
    map<string, bool> toggles = b.getToggles();
    map<string, bool> buttons = b.getButtons();
    vector<string> password = b.getPassword();
    for (const auto& [key, value] : wires) {
        cout << key << " cut: " << boolalpha << value << endl;
    }
    for (const auto& [key, value] : toggles) {
        cout << key << ": " << boolalpha << value << endl;
    }
    for (const auto& [key, value] : buttons) {
        cout << key << " is pressed: " << boolalpha << value << endl;
    }
    cout << "Entered password: ";
    for (int i = 0; i < password.size(); i++) {
        cout << password[i] << " ";
    }
    cout << endl;
}

int main() {
    vector<string> colors = {"red", "blue", "green"};
    vector<string> labels = {"hot", "explode", "on"};
    vector<string> keys = {"A", "B", "C", "D"};
    map<string, bool> rules;
    bomb b(colors, labels, keys, rules);
    printInfo(b);
    return 0;
}

