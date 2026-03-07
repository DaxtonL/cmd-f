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
    bool run = true;
    vector<string> colors = {"red", "blue", "green"};
    vector<string> labels = {"hot", "explode", "on"};
    vector<string> keys = {"A", "B", "C", "D"};
    map<string, bool> rules;
    bomb b(colors, labels, keys, rules);
    printInfo(b);
    while (run) {
        string input;
        cout << "Input action: " << endl;
        getline(cin, input);
        system("clear");
        if (input == "exit") {
            run = false;
            break;
        } else if (input == "cut") {
            cout << "What wire do you want to cut" << endl;
            getline(cin, input);
            b.cutWire(input);
        } else if (input == "flip") {
            cout << "What toggle do you want to flip" << endl;
            getline(cin, input);
            b.flipToggle(input);
        } else if (input == "press") {
            cout << "What button do you want to press" << endl;
            getline(cin, input);
            b.pressButton(input);
        }
        printInfo(b);
        cout << endl;
    }
    return 0;
}

