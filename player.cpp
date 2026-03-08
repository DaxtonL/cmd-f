#include <string>
#include <vector>
#include <utility>
using namespace std;

class player {
    public:
        // creates a new player with a name and a set of rules to follow
        player(string name, vector<string> rules) : name(std::move(name)), rules(std::move(rules)) {
            // already complete
        }

        const string& getName() const {
           return name;
        }

        const vector<string>& getRules() const {
            return rules;
        }

    private:
        string name;
        vector<string> rules;
};
