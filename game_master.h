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
    game_master(int t);

    void setupGame();
    void printInfo() const;
    void printRules() const;

    void handleCommand(const string& input);
    void update();
    bool isGameOver() const;
    void run();

private:
    bomb current_bomb;
    solution current_solution;

    int timer;
    bool exploded;
    bool defused;
    bool running;

    vector<bool> wire_solution;
    map<string, bool> toggle_solution;
    vector<string> password_solution;
};