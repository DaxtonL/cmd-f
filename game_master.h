#pragma once
#include <vector>
#include <string>
#include <map>
#include "bomb.h"
#include "solution.h"
#include "player.h"

using namespace std;

class game_master {
public:
    game_master();
    void innit(int t, int n);

    // game actions
    bool cutWire(int index);
    void flipToggle(const string& label);
    void pressButton(const string& key);

    // state update/checks
    void update();
    bool handle_events();
    bool isGameOver() const;
    bool isDefused() const;
    bool isExploded() const;

    // output helpers
    void render() const;
    void printInfo() const;
    void printRules() const;
    void getRules() const;

    // player helpers
    vector<player> make_players(int n);
    vector<player> getPlayers() const;
    
    // getters for frontend/backend
    int getTimer() const;
    bomb getBomb() const;

    void run();

private:

    bomb current_bomb;
    solution current_solution;
    vector<player> players;

    int timer;
    int num_players;
    bool exploded;
    bool defused;
    bool running;

    vector<bool> wire_solution;
    map<string, bool> toggle_solution;
    vector<string> password_solution;
};
