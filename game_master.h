#pragma once
#include <vector>
#include <string>
#include <map>
#include "player.cpp"

using namespace std::chrono_literals;

struct game_master
{
    // this contains the state of your game, such as positions and velocities
    game_master(int t);
    game_master();

    // poll for events
    bool handle_events();

    void update(game_master *state);

    void render(game_master const &state);

    int main();
};