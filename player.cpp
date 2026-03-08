#include "player.h"
#include <utility>

player::player(string name, vector<string> rules)
    : name(std::move(name)), rules(std::move(rules)) {
}

const string& player::getName() const {
    return name;
}

const vector<string>& player::getRules() const {
    return rules;
}