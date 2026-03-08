#include <iostream>
#include <vector>
#include <utility>
#include <string>
#include "bomb.cpp"
using namespace std;

class solution {
    public:
        void generate_solution(bomb b, int n) {
            while (n > 0) {
                
                int i;
                switch (i)
                {
                case 1:
                    // cut wire 
                    // pick a random wire that hasn't been cut,
                    // cut it, update solution
                    break;
                case 2:
                    // never cut a wire
                    // pick a random wire that hasn't been cut, 
                    // mark it as cannot bet cut
                case 3:
                    // cut all of one color
                    // add flag so this can only happen n times
                case 4:
                    // cut wire x if it is color y
                case 5:
                    // cut wire x only if wire y is cut
                
                default:
                    break;
                }
                n--;
            }
        }

    private:
        map<string, vector<pair<bool, bool>>> wire_solution;
        map<string, bool> toggle_solution = {{"hot", true}, {"explode", true}, {"on", false}};
        vector<string> password_solution = { "1", "2", "3", "4"};
        vector<string> rules;

        // returns a changeable wire that hasn't been cut
        string findWire() {
            for (const auto& [key, vec] : wire_solution) { 
                for (const auto& p : vec) {
                    if (!p.first && !p.second) {
                        return key;                           
                    }
                }
            }
            return "";
        }
        
};