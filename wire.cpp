#include <string>
using namespace std;

class wire {
    public:
        wire() {
            color = "NO SET COLOR";
            cut = false;
            never_cut = false;
        }

        void cutWire() {
            cut = true;
        }

        bool getIscut() {
            return cut;
        }

        void setColor(string s) {
            color = s;
        }

        string getColor() {
            return color;
        }
    
    private:

    string color;
    bool cut;
    bool never_cut;
};