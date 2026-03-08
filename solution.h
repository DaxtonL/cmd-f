#pragma once
#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <random>
#include <algorithm>
#include "bomb.h"
#include "wire.h"
#include "player.h"
using namespace std;

class solution {
    public:
        // Generates a solution for the provided bomb using n rules.
        void generateSolution(bomb b, int n);
        // Backward-compatible wrapper.
        void generate_solution(bomb b, int n);
        bool bombIsDefused(bomb b);
        bool bombIsDetonated(bomb b);
        bool checkResetPassword(bomb b);
        vector<string> getRules();

    private:
        int findWire();
        bool cutWireRule();
        bool neverCutWireRule();
        void toggleRule(bomb b, mt19937 gen);
        void cutAllRule(bomb b);
        void cutIfRule(bomb b, mt19937 gen);
        void passwordRule(bomb b, mt19937 gen);

        vector<bool> getWireSolution();
        vector<string> getPassword();
        vector<pair<wire, bool>> wire_solution;
        map<string, bool> toggle_solution;
        vector<string> password_solution;
        vector<string> rules;
        string pickColor(vector<wire> wires);        
};
