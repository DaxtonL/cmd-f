/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Mario Badr
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#include <iostream>
#include <vector>
#include <string>
#include <map>
#include "player.h"
#include "game_master.h"
#include "bomb.h"
#include "solution.h"

using namespace std;

game_master::game_master()
    : current_bomb(5, 3, 4),
      timer(0),
      num_players(0),
      exploded(false),
      defused(false),
      running(false) {
}

void game_master::innit(int t, int n) {
    timer = t;
    num_players = n;
    exploded = false;
    defused = false;
    running = true;

    current_bomb = bomb(5, 3, 4);
    current_solution = solution();
    current_solution.generate_solution(current_bomb, num_players);

    players = make_players(num_players);
}

vector<player> game_master::make_players(int n) {
    vector<player> made_players;

    solution solution_snapshot = current_solution;
    vector<string> rules = solution_snapshot.getRules();

    if (n <= 0) {
        return made_players;
    }

    for (int i = 0; i < n; i++) {
        vector<string> one_player_rules;

        if (i < static_cast<int>(rules.size())) {
            one_player_rules.push_back(rules[i]);
        }

        made_players.emplace_back("Player " + to_string(i + 1), one_player_rules);
    }

    return made_players;
}

vector<player> game_master::getPlayers() const {
    return players;
}

bool game_master::cutWire(int index) {
    bool success = current_bomb.cutWire(index);
    update();
    return success;
}

void game_master::flipToggle(const string& label) {
    current_bomb.flipToggle(label);
    update();
}

void game_master::pressButton(const string& key) {
    current_bomb.pressButton(key);

    if (current_solution.checkResetPassword(current_bomb)) {
        current_bomb.resetButtons();
    }

    update();
}

void game_master::update() {
    defused = current_solution.bombIsDefused(current_bomb);
    exploded = current_solution.bombIsDetonated(current_bomb);

    if (defused || exploded) {
        running = false;
    }
}

bool game_master::handle_events() {
    update();
    return !running;
}

bool game_master::isGameOver() const {
    return !running;
}

bool game_master::isDefused() const {
    return defused;
}

bool game_master::isExploded() const {
    return exploded;
}

int game_master::getTimer() const {
    return timer;
}

bomb game_master::getBomb() const {
    return current_bomb;
}

void game_master::printInfo() const {
    bomb bomb_snapshot = current_bomb;

    vector<wire> wires = bomb_snapshot.getWires();
    map<string, bool> toggles = bomb_snapshot.getToggles();
    map<string, bool> buttons = bomb_snapshot.getButtons();
    vector<string> password = bomb_snapshot.getPassword();

    cout << "Timer: " << timer << endl << endl;

    for (int i = 0; i < static_cast<int>(wires.size()); i++) {
        cout << "Wire " << i << " " << wires[i].getColor()
             << " cut: " << boolalpha << wires[i].getIscut() << endl;
    }

    cout << endl;

    for (const auto& [key, value] : toggles) {
        cout << key << ": " << boolalpha << value << endl;
    }

    cout << endl;

    for (const auto& [key, value] : buttons) {
        cout << key << " is pressed: " << boolalpha << value << endl;
    }

    cout << endl << "Entered password: ";
    for (const auto& p : password) {
        cout << p << " ";
    }
    cout << endl << endl;
}

void game_master::printRules() const {
    solution solution_snapshot = current_solution;
    vector<string> rules = solution_snapshot.getRules();

    for (const auto& rule : rules) {
        cout << rule << endl;
    }
    cout << endl;
}

void game_master::getRules() const {
    for (const auto& p : players) {
        cout << p.getName() << ":" << endl;
        for (const auto& rule : p.getRules()) {
            cout << "  " << rule << endl;
        }
    }
    cout << endl;
}

void game_master::render() const {
    printInfo();
}

void game_master::run() {
    while (running) {
        render();

        string input;
        cout << "Input action (cut / flip / press / rules / players / exit): " << endl;
        getline(cin, input);

        if (input == "exit") {
            running = false;
            break;
        } else if (input == "cut") {
            cout << "What wire do you want to cut" << endl;
            getline(cin, input);
            cutWire(stoi(input));
        } else if (input == "flip") {
            cout << "What toggle do you want to flip" << endl;
            getline(cin, input);
            flipToggle(input);
        } else if (input == "press") {
            cout << "What button do you want to press" << endl;
            getline(cin, input);
            pressButton(input);
        } else if (input == "rules") {
            printRules();
        } else if (input == "players") {
            getRules();
        }

        if (exploded) {
            cout << "BOOM" << endl;
            break;
        }

        if (defused) {
            cout << "Bomb defused!" << endl;
            break;
        }
    }
}
