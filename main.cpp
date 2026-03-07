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
    cout << endl;
    for (const auto& [key, value] : toggles) {
        cout << key << ": " << boolalpha << value << endl;
    }
    cout << endl;
    for (const auto& [key, value] : buttons) {
        cout << key << " is pressed: " << boolalpha << value << endl;
    }
    cout << endl;
    cout << "Entered password: ";
    for (int i = 0; i < password.size(); i++) {
        cout << password[i] << " ";
    }
    cout << endl << endl;
}

int main() {
    bool run = true;
    vector<string> colors = {"red", "blue", "green"};
    vector<string> labels = {"hot", "explode", "on"};
    vector<string> keys = {"1", "2", "3", "4"};
    map<string, bool> rules;
    bomb b(colors, labels, keys, rules);

    map<string, bool> wire_solution = {{"red", true}, {"blue", false}, {"green", false}};
    map<string, bool> toggle_solution = {{"hot", true}, {"explode", true}, {"on", false}};
    vector<string> password_solution = { "1", "2", "3", "4"};

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
            if (b.cutWire(input)) {
                if (wire_solution[input] == false) {
                    system("clear");
                    cout << "BOOM" << endl;
                    run = false;
                    break;
                }
            }
        } else if (input == "flip") {
            cout << "What toggle do you want to flip" << endl;
            getline(cin, input);
            b.flipToggle(input);
        } else if (input == "press") {
            cout << "What button do you want to press" << endl;
            getline(cin, input);
            b.pressButton(input);
            if (b.getPassword().size() >= password_solution.size()) {
                if (b.getPassword() != password_solution) {
                    b.resetButtons();
                }
            }
        }
        bool wires_s = (b.getWires() == wire_solution);
        bool toggles_s = (b.getToggles() == toggle_solution);
        bool password_s = (b.getPassword() == password_solution);
        if (wires_s && toggles_s && password_s) {
            cout << "Bomb defused!" << endl;
            run = false;
            break;
        } else {
            printInfo(b);
            cout << endl;
        }
    }
    return 0;
}

