#pragma once
#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <random>
#include "bomb.h"
#include "wire.h"
using namespace std;

class solution {
    public:
        void generate_solution(bomb b, int n);
        vector<bool> getWireSolution();

        vector<string> getRules();

    private:
        // returns a changeable wire that hasn't been cut
        int findWire();

        vector<pair<wire, bool>> wire_solution; // second bool represents if wire can be changed
        map<string, bool> toggle_solution = {{"hot", true}, {"explode", true}, {"on", false}};
        vector<string> password_solution = { "1", "2", "3", "4"};
        vector<string> rules;
};