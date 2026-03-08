#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include <random>
#include "bomb.cpp"
#include "wire.cpp"
using namespace std;

class solution {
    public:
        void generate_solution(bomb b, int n) {
            random_device rd;                   // 1
            mt19937 gen(rd());                  // 2
            uniform_int_distribution<> dist(1, 10); // 3
            int x = findWire();
            vector<wire> wires = b.getWires();
            wire_solution.clear();
            for (int i = 0; i < wires.size(); i++) {
                pair<wire, bool> w = {wires[i], false};
                wire_solution.push_back(w);
            }
            while (n > 0) {
                int i = (dist(gen) % 2) + 1;
                switch (i)
                {
                case 1:
                    // cut wire 
                    // pick a random wire that hasn't been cut,
                    // cut it, update solution
                    if (x != -1) {
                        wire_solution[i].first.cutWire();
                        wire_solution[i].second = false;
                        string s = "Cut wire " + to_string(i);
                        rules.push_back(s);
                    }
                    break;
                case 2:
                    // never cut a wire
                    // pick a random wire that hasn't been cut, 
                    // mark it as cannot bet cut
                    if (x != -1) {
                        wire_solution[i].second = false;
                        string s = "Never cut wire " + to_string(i);
                        rules.push_back(s);
                    }
                    break;
                default:
                    break;
                }
                n--;
            }
        }

        vector<bool> getWireSolution() {
            vector<bool> wires;
            for (int i = 0; i < wire_solution.size(); i++) {
                wires.push_back(wire_solution[i].first.getIscut());
            }
            return wires;
        }

        vector<string> getRules() {
            return rules;
        }

    private:
        vector<pair<wire, bool>> wire_solution; // second bool represents if wire can be changed
        map<string, bool> toggle_solution = {{"hot", true}, {"explode", true}, {"on", false}};
        vector<string> password_solution = { "1", "2", "3", "4"};
        vector<string> rules;

        // returns a changeable wire that hasn't been cut
        int findWire() {
            for (int i = 0; i < wire_solution.size(); i++) {
                pair<wire,bool> w = wire_solution[i];
                if (w.first.getIscut() == false && w.second == false) {
                    return i;
                }
            }
            return -1;
        }
};