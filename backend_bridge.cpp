#include <cctype>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "bomb.h"
#include "game_master.h"
#include "player.h"

using namespace std;

namespace {
string trim(const string& input) {
    size_t left = 0;
    while (left < input.size() && isspace(static_cast<unsigned char>(input[left]))) {
        left++;
    }
    size_t right = input.size();
    while (right > left && isspace(static_cast<unsigned char>(input[right - 1]))) {
        right--;
    }
    return input.substr(left, right - left);
}

string json_escape(const string& input) {
    ostringstream out;
    for (char c : input) {
        switch (c) {
            case '\\':
                out << "\\\\";
                break;
            case '"':
                out << "\\\"";
                break;
            case '\n':
                out << "\\n";
                break;
            case '\r':
                out << "\\r";
                break;
            case '\t':
                out << "\\t";
                break;
            default:
                out << c;
                break;
        }
    }
    return out.str();
}

void append_bool(ostringstream& out, bool value) {
    out << (value ? "true" : "false");
}

string state_to_json(game_master& gm) {
    bomb b = gm.getBomb();
    vector<wire> wires = b.getWires();
    map<string, bool> toggles = b.getToggles();
    map<string, bool> buttons = b.getButtons();
    vector<string> password = b.getPassword();
    vector<string> rules = gm.getRules();
    vector<player> players = gm.getPlayers();

    ostringstream out;
    out << "{";
    out << "\"timer\":" << gm.getTimer() << ",";
    out << "\"numPlayers\":" << gm.getNumPlayers() << ",";

    out << "\"wires\":[";
    for (size_t i = 0; i < wires.size(); i++) {
        if (i > 0) {
            out << ",";
        }
        out << "{";
        out << "\"id\":" << i << ",";
        out << "\"color\":\"" << json_escape(wires[i].getColor()) << "\",";
        out << "\"cut\":";
        append_bool(out, wires[i].getIscut());
        out << "}";
    }
    out << "],";

    out << "\"toggles\":{";
    bool first_toggle = true;
    for (const auto& pair : toggles) {
        if (!first_toggle) {
            out << ",";
        }
        first_toggle = false;
        out << "\"" << json_escape(pair.first) << "\":";
        append_bool(out, pair.second);
    }
    out << "},";

    out << "\"buttons\":{";
    bool first_button = true;
    for (const auto& pair : buttons) {
        if (!first_button) {
            out << ",";
        }
        first_button = false;
        out << "\"" << json_escape(pair.first) << "\":";
        append_bool(out, pair.second);
    }
    out << "},";

    out << "\"password\":[";
    for (size_t i = 0; i < password.size(); i++) {
        if (i > 0) {
            out << ",";
        }
        out << "\"" << json_escape(password[i]) << "\"";
    }
    out << "],";

    out << "\"rules\":[";
    for (size_t i = 0; i < rules.size(); i++) {
        if (i > 0) {
            out << ",";
        }
        out << "\"" << json_escape(rules[i]) << "\"";
    }
    out << "],";

    out << "\"players\":[";
    for (size_t i = 0; i < players.size(); i++) {
        if (i > 0) {
            out << ",";
        }
        out << "{";
        out << "\"name\":\"" << json_escape(players[i].getName()) << "\",";
        out << "\"rules\":[";
        const auto& player_rules = players[i].getRules();
        for (size_t j = 0; j < player_rules.size(); j++) {
            if (j > 0) {
                out << ",";
            }
            out << "\"" << json_escape(player_rules[j]) << "\"";
        }
        out << "]";
        out << "}";
    }
    out << "],";

    out << "\"exploded\":";
    append_bool(out, gm.isExploded());
    out << ",";
    out << "\"defused\":";
    append_bool(out, gm.isDefused());
    out << ",";
    out << "\"running\":";
    append_bool(out, !gm.isGameOver());
    out << "}";

    return out.str();
}

string error_json(const string& message) {
    return "{\"error\":\"" + json_escape(message) + "\"}";
}

}  // namespace

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    game_master gm;
    gm.innit(180, 2);

    string line;
    while (getline(cin, line)) {
        line = trim(line);
        if (line.empty()) {
            continue;
        }

        istringstream parser(line);
        string command;
        parser >> command;

        if (command == "QUIT") {
            cout << "{\"ok\":true}" << '\n' << flush;
            break;
        }

        if (command == "INIT") {
            int timer = 180;
            int players = 2;
            if (!(parser >> timer >> players)) {
                cout << error_json("INIT requires: timer players") << '\n' << flush;
                continue;
            }
            gm.innit(timer, players);
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        if (command == "CUT") {
            int index = -1;
            if (!(parser >> index)) {
                cout << error_json("CUT requires: index") << '\n' << flush;
                continue;
            }
            gm.cutWire(index);
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        if (command == "TOGGLE") {
            string label;
            if (!(parser >> label)) {
                cout << error_json("TOGGLE requires: label") << '\n' << flush;
                continue;
            }
            gm.flipToggle(label);
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        if (command == "BUTTON") {
            string key;
            if (!(parser >> key)) {
                cout << error_json("BUTTON requires: key") << '\n' << flush;
                continue;
            }
            gm.pressButton(key);
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        if (command == "RESET") {
            gm.resetPassword();
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        if (command == "STATE") {
            gm.update();
            cout << state_to_json(gm) << '\n' << flush;
            continue;
        }

        cout << error_json("Unknown command") << '\n' << flush;
    }

    return 0;
}
