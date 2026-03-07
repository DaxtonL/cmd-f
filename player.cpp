#include <string>
#include <vector>
using namespace std;

class player {
    public:
        // creates a new player with a name and a set of rules to follow
        player(string name, vector<string> rules) {
            // TODO
        }

        string getName() {
           return name;
        }

        vector<string> getRules() {
            return rules;
        }

    private:
        string name;
        vector<string> rules;
};