#ifndef PLAYER_H
#define PLAYER_H

#include <string>
#include <vector>
#include <utility>

using namespace std;

class player {
public:
    player(string name, vector<string> rules)
        : name(std::move(name)), rules(std::move(rules)) {}

    const string& getName() const;
    const vector<string>& getRules() const;

private:
    string name;
    vector<string> rules;
};

#endif