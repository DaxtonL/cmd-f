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
    void innit(int t);

    void setupGame();
    void printInfo() const;
    void printRules() const;

    void update();
    bool isGameOver() const;
    void run();
    void render(game_master const &state);
    bool handle_events();
    void update(game_master *state);

    private : 
    
    bomb current_bomb = bomb();
    solution current_solution;

    int timer = 0;
    int num_players = 0;
    bool exploded = false;
    bool defused = false;
    bool running = false;

    vector<bool> wire_solution;
    map<string, bool> toggle_solution;
    vector<string> password_solution;
};