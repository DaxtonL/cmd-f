#pragma once
#include <string>
using namespace std;

class wire {
    public:
        wire();
        void cutWire();
        bool getIscut();
        void setColor(string s);
        string getColor();
    
    private:

    string color;
    bool cut;
};