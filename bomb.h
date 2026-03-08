#pragma once
#include <vector>
#include <string>
#include <map>
#include "wire.h"
using namespace std;

class bomb{
    public:
        // creates a new bomb
        // takes in a list of colors, labels, and keys for elements
        // and a map of "facts"
        bomb();
        bomb(vector<string> colors, vector<string> labels, vector<string> keys, map<string, bool> facts_);

        // if the wire is not cut, cut it
        // returns true if there is a wire to cuts
        bool cutWire(int n);

        // switches value of toggle if it exists
        void flipToggle(string label);
        // if the button has not been pressed yet, add its key to the "password" and set it to pressed
        void pressButton(string key);

        vector<wire> getWires();

        map<string, bool> getToggles();
        
        map<string, bool> getButtons();

        vector<string> getPassword();

        void resetButtons();

        bool compareWires(vector<bool> solution);

    private:
        vector<wire> wires;
        map<string, bool> toggles;      
        map<string, bool> buttons;      // true = pressed
        map<string, bool> facts;
        vector<string> password;
};