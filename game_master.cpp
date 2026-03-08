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

#pragma once
#include <vector>
#include <string>
#include <map>
#include "player.h"
#include "game_master.h"
#include "bomb.h"

#include <chrono>

using namespace std::chrono_literals;

// we use a fixed timestep of 1 / (60 fps) = 16 milliseconds
constexpr std::chrono::nanoseconds timestep(16ms);

game_master::game_master()
{
    // this contains the state of your game, such as positions and velocities
    int timer;
    bomb current_bomb;
    solution current_solution;
    int num_players;
    bool exploded;
    bool defused;
    bool running;
    start_time = std::chrono::steady_clock::now();
};

void game_master::innit(int t)
{
    // this contains the state of your game, such as positions and velocities
    int timer = t; 
    bomb current_bomb();
    solution current_solution(current_bomb, num_players);

};

bool game_master::handle_events()
{
    // poll for events

    return false; // true if the user wants to quit the game
}

void game_master::update(game_master *state)
{
    // update game logic here
    auto elapsed = std::chrono::steady_clock::now() - start_time;
}


void game_master::render(game_master const &state)
{
    // render stuff here
}

// game_master interpolate(game_master const &current, game_master const &previous, float alpha)
// {
//     game_master interpolated_state;

//     // interpolate between previous and current by alpha here

//     return interpolated_state;
// }

void game_master::run()
{
    using clock = std::chrono::high_resolution_clock;

    std::chrono::nanoseconds lag(0ns);
    auto time_start = clock::now();
    bool quit_game = false;

    game_master current_state;
    game_master previous_state;
    // test

    while (!quit_game)
    {
        auto delta_time = clock::now() - time_start;
        time_start = clock::now();
        lag += std::chrono::duration_cast<std::chrono::nanoseconds>(delta_time);

        quit_game = handle_events();

        // update game logic as lag permits
        while (lag >= timestep)
        {
            lag -= timestep;

            previous_state = current_state;
            update(&current_state); // update at a fixed rate each time
        }

        // calculate how close or far we are from the next timestep
        auto alpha = (float)lag.count() / timestep.count();
    }
}