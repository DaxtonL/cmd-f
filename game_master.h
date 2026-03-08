#pragma once

#include <map>
#include <string>
#include <vector>

#include "bomb.h"
#include "player.h"
#include "solution.h"

using namespace std;

class game_master {
public:
    game_master();

    void innit(int t, int n);

    bool cutWire(int index);
    void flipToggle(const string& label);
    void pressButton(const string& key);
    void resetPassword();

    void update();

    bool isGameOver() const;
    bool isDefused() const;
    bool isExploded() const;

    int getTimer() const;
    int getNumPlayers() const;
    bomb getBomb() const;
    vector<player> getPlayers() const;
    vector<string> getRules() const;

private:
    vector<player> make_players(int n, const vector<string>& rule_list) const;

    bomb current_bomb;
    solution current_solution;
    vector<player> players;
    vector<string> rules;

    int timer = 0;
    int num_players = 0;
    bool exploded = false;
    bool defused = false;
    bool running = false;
};
