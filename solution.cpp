#include "solution.h"


void solution::generate_solution(bomb b, int n) {
    vector<wire> wires = b.getWires();
    toggle_solution = b.getToggles();
    wire_solution.clear();
    for (int i = 0; i < wires.size(); i++) {
        pair<wire, bool> w = {wires[i], false};
        wire_solution.push_back(w);
    }
    while (n > 0) {
        int i = 6-n;
        int x = findWire();
        vector<string> pass;
        mt19937 gen(std::random_device{}());
        string s;
        bool color_flag = false;
        switch (i)
        {
        case 0:
            // cut wire 
            // pick a random wire that hasn't been cut,
            // cut it, update solution
            if (x != -1) {
                wire_solution[x].first.cutWire();
                s = "Cut wire " + to_string(x);
                rules.push_back(s);
            }
            n--;
            break;
        case 1:
            // never cut a wire
            // pick a random wire that hasn't been cut, 
            // mark it as cannot bet cut
            if (x != -1) {
                wire_solution[x].second = true;
                s = "Never cut wire " + to_string(x);
                rules.push_back(s);
            }
            n--;
            break;
        case 2:
            // generate password
            for (auto& pair : b.getButtons()) {
                pass.push_back(pair.first);
            }
            shuffle(pass.begin(), pass.end(), gen);
            s = "Password is: ";
            password_solution = pass;
            for (int i = 0; i < password_solution.size(); i++) {
                s.append(password_solution[i]);
            }
            rules.push_back(s);
            n--;
            break;
        case 3:
            // Generate a toggle
            s = getToggle(b.getToggles());
            toggle_solution[s] = true;
            s.append(" should be on");
            rules.push_back(s);
            n--;
            break;
        case 4:
            s = pickColor(b.getWires());
            for (int i = 0; i < wire_solution.size(); i++) {
                if (wire_solution[i].first.getColor() == s) {
                    if (wire_solution[i].second != true) {
                        wire_solution[i].first.cutWire();
                    }
                }
            }
            s = "Cut all " + s + " wires";
            rules.push_back(s);
            n--;
            break;
        case 5: {
            uniform_int_distribution<> dist(0, wire_solution.size()-1);
            int z = dist(gen);
            s = pickColor(b.getWires());
            if (wire_solution[z].first.getColor() == s) {
                wire_solution[x].first.cutWire();
            }
            s = "If wire " + to_string(z) + " is " + s + " cut wire " + to_string(x);
            rules.push_back(s);
            n--;
            break;
        }
        default:
            n--;
            break;
        }
    }
}

vector<bool> solution::getWireSolution() {
    vector<bool> wires;
    for (int i = 0; i < wire_solution.size(); i++) {
        wires.push_back(wire_solution[i].first.getIscut());
    }
    return wires;
}

vector<string> solution::getRules() {
    return rules;
}

vector<string> solution::getPassword() {
    return password_solution;
}

// returns a changeable wire that hasn't been cut
int solution::findWire() {
    vector<int> wires;
    for (int i = 0; i < wire_solution.size(); i++) {
        pair<wire,bool> w = wire_solution[i];
        if (w.first.getIscut() == false && w.second == false) {
            wires.push_back(i);
        }
    }

    if (wires.empty()) {
        return -1;
    }

    random_device rd;                                    // 1
    mt19937 gen(rd());                                   // 2
    uniform_int_distribution<> dist(0, wires.size()-1);  // 3
    int z = dist(gen);
    return wires[z];
}

string solution::getToggle(map<string,bool> toggles) {
    vector<string> t;
    for (auto& pair : toggles) {
        t.push_back(pair.first);
    }
    
    mt19937 gen(std::random_device{}());
    uniform_int_distribution<> dist(0, t.size()-1);
    return t[dist(gen)];
}

string solution::pickColor(vector<wire> wires) {
    vector<string> colors;
    for (int i = 0; i < wires.size(); i++) {
        colors.push_back(wires[i].getColor());
    }
    mt19937 gen(std::random_device{}());
    uniform_int_distribution<> dist(0, colors.size()-1);
    return colors[dist(gen)];
}

map<string, bool> solution::getToggleSolution() {
    return toggle_solution;
}

bool solution::bombIsDefused(bomb b) {
    bool wire_s = b.compareWires(getWireSolution());
    bool toggles_s = (b.getToggles() == getToggleSolution());
    bool password_s = (b.getPassword() == getPassword());
    return wire_s && toggles_s && password_s;
}

bool solution::bombIsDetonated(bomb b) {
    vector<wire> wires = b.getWires();
    for (int i = 0; i < wires.size(); i++) {
        if (wires[i].getIscut() == true && getWireSolution()[i] == false) {
            return true;
            // you cut something you shouldn't have
        }
    }
    return false;
}

vector<wire> solution::getWiresWithColor(string color, vector<wire> wires) {
    vector<wire> c_wires;
    for (int i = 0; i < wires.size(); i++) {
        if (wires[i].getColor() == color) {
            c_wires.push_back(wires[i]);
        }
    }
    return c_wires;
}

bool solution::checkResetPassword(bomb b) {
    if (b.getPassword().size() >= password_solution.size()) {
        if (b.getPassword() != password_solution) {
            return true;
        }
    }
    return false;
}
