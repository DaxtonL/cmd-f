#include "game_master.h"

#include <algorithm>

namespace {
bomb make_bomb() {
    return bomb(5, 3, 4);
}
}

game_master::game_master() = default;

void game_master::innit(int t, int n) {
    timer = t;
    num_players = max(1, n);

    current_bomb = make_bomb();
    current_solution = solution();
    // Build one solution rule per player from the generated bomb solution.
    current_solution.generateSolution(current_bomb, num_players);

    rules = current_solution.getRules();
    players = make_players(num_players, rules);

    exploded = false;
    defused = false;
    running = true;

    update();
}

bool game_master::cutWire(int index) {
    bool ok = current_bomb.cutWire(index);
    if (ok) {
        update();
    }
    return ok;
}

void game_master::flipToggle(const string& label) {
    current_bomb.flipToggle(label);
    update();
}

void game_master::pressButton(const string& key) {
    current_bomb.pressButton(key);
    update();
}

void game_master::resetPassword() {
    current_bomb.resetButtons();
    update();
}

void game_master::update() {
    if (current_solution.checkResetPassword(current_bomb)) {
        current_bomb.resetButtons();
    }

    defused = current_solution.bombIsDefused(current_bomb);
    exploded = current_solution.bombIsDetonated(current_bomb);
    running = !isGameOver();
}

bool game_master::isGameOver() const {
    return exploded || defused || timer <= 0;
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

int game_master::getNumPlayers() const {
    return num_players;
}

bomb game_master::getBomb() const {
    return current_bomb;
}

vector<player> game_master::getPlayers() const {
    return players;
}

vector<string> game_master::getRules() const {
    return rules;
}

vector<player> game_master::make_players(int n, const vector<string>& rule_list) const {
    vector<player> result;
    result.reserve(static_cast<size_t>(n));

    for (int i = 0; i < n; i++) {
        vector<string> player_rules;
        if (i < static_cast<int>(rule_list.size())) {
            player_rules.push_back(rule_list[i]);
        }
        if (player_rules.empty()) {
            player_rules.push_back("No rule assigned");
        }

        result.emplace_back("Player " + to_string(i + 1), player_rules);
    }

    return result;
}
