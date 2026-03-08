#pragma once
#include <string>
#include <vector>

using namespace std;

class player {
public:
    player(string name, vector<string> rules);

    const string& getName() const;
    const vector<string>& getRules() const;

private:
    string name;
    vector<string> rules;
};