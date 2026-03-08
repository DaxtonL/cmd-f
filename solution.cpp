#include "solution.h"


void solution::generate_solution(bomb b, int n) {
    vector<wire> wires = b.getWires();
    toggle_solution = b.getToggles();
    wire_solution.clear();
    for (int i = 0; i < (int)wires.size(); i++) {
        pair<wire, bool> w = {wires[i], false};
        wire_solution.push_back(w);
    }

    while (n > 0) {
        int i = 6-n;
        vector<string> pass;
        mt19937 gen(std::random_device{}());
        switch (i)
        {
        case 0:
            cutWireRule();
            n--;
            break;
        case 1:
            neverCutWireRule();
            n--;
            break;
        case 2:
            passwordRule(b, gen);
            n--;
            break;
        case 3:
            toggleRule(b, gen);
            n--;
            break;
        case 4:
            cutAllRule(b);
            n--;
            break;
        case 5: {
            cutIfRule(b, gen);
            n--;
            break;
        }
        default:
            n--;
            break;
        }
    }
}

bool solution::cutWireRule() {
    int n = findWire();
    // Guard against no valid wires
    if (n == -1) {
        return false;
    }
    wire_solution[n].first.cutWire();
    string s = "Cut wire " + to_string(n);
    rules.push_back(s);
    return true;
}

bool solution::neverCutWireRule() {
    int n = findWire();
    // Guard against no valid wires
    if (n == -1) {
        return false;
    }
    wire_solution[n].second = true;
    string s = "Never cut wire " + to_string(n);
    rules.push_back(s);
    return true;
}

void solution::toggleRule(bomb b, mt19937 gen) {
    vector<string> toggles;
    for (auto& pair : b.getToggles()) {
        toggles.push_back(pair.first);
    }
    
    uniform_int_distribution<> dist(0, toggles.size()-1);

    string s = toggles[dist(gen)];
    toggle_solution[s] = true;
    s.append(" should be on");
    rules.push_back(s);
}

void solution::cutAllRule(bomb b) {
    string s = pickColor(b.getWires());
    for (int i = 0; i < (int)wire_solution.size(); i++) {
        if (wire_solution[i].first.getColor() == s) {
            if (wire_solution[i].second != true) {
                wire_solution[i].first.cutWire();
            }
        }
    }
    s = "Cut all " + s + " wires";
    rules.push_back(s);
}

void solution::cutIfRule(bomb b, mt19937 gen) {
    int n = findWire();
    uniform_int_distribution<> dist(0, wire_solution.size()-1);
    int z = dist(gen);
    string s = pickColor(b.getWires());
    if (wire_solution[z].first.getColor() == s) {
        wire_solution[n].first.cutWire();
    }
    s = "If wire " + to_string(z) + " is " + s + " cut wire " + to_string(n);
    rules.push_back(s);
}

void solution::passwordRule(bomb b, mt19937 gen) {
    string s;
    vector<string> pass;
    for (auto& pair : b.getButtons()) {
        pass.push_back(pair.first);
    }
    shuffle(pass.begin(), pass.end(), gen);
    s = "Password is: ";
    password_solution = pass;
    for (int i = 0; i < (int)password_solution.size(); i++) {
        s.append(password_solution[i]);
    }
    rules.push_back(s);
}


vector<bool> solution::getWireSolution() {
    vector<bool> wires;
    for (int i = 0; i < (int)wire_solution.size(); i++) {
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
    vector<int> valid_wires;
    // Searches for valid wires
    for (int i = 0; i < (int)wire_solution.size(); i++) {
        pair<wire,bool> w = wire_solution[i];
        if (w.first.getIscut() == false && w.second == false) {
            valid_wires.push_back(i);
        }
    }

    if (valid_wires.empty()) {
        return -1;
    }

    random_device rd;                                           // 1
    mt19937 gen(rd());                                          // 2
    uniform_int_distribution<> dist(0, valid_wires.size()-1);   // 3
    int z = dist(gen);
    return valid_wires[z];
}

string solution::pickColor(vector<wire> wires) {
    vector<string> colors;
    for (int i = 0; i < (int)wires.size(); i++) {
        colors.push_back(wires[i].getColor());
    }
    mt19937 gen(std::random_device{}());
    uniform_int_distribution<> dist(0, colors.size()-1);
    return colors[dist(gen)];
}

bool solution::bombIsDefused(bomb b) {
    bool wire_s = b.compareWires(getWireSolution());
    bool toggles_s = (b.getToggles() == toggle_solution);
    bool password_s = (b.getPassword() == getPassword());
    return wire_s && toggles_s && password_s;
}

bool solution::bombIsDetonated(bomb b) {
    vector<wire> wires = b.getWires();
    for (int i = 0; i < (int)wires.size(); i++) {
        if (wires[i].getIscut() == true && getWireSolution()[i] == false) {
            return true;
            // you cut something you shouldn't have
        }
    }
    return false;
}

bool solution::checkResetPassword(bomb b) {
    if (b.getPassword().size() >= password_solution.size()) {
        if (b.getPassword() != password_solution) {
            return true;
        }
    }
    return false;
}
