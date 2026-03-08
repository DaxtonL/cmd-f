#include <string>
#include <vector>
#include <utility>
using namespace std;
class player {

    public: 
        player(string name, vector<string> rules) : name(std::move(name)), rules(std::move(rules));
        const string& getName();
        const vector<string>& getRules();

    private:
        string name;
        vector<string> rules;
};