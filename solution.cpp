#include "solution.h"


void solution::generate_solution(bomb b, int n) {
    vector<wire> wires = b.getWires();
    wire_solution.clear();
    for (int i = 0; i < wires.size(); i++) {
        pair<wire, bool> w = {wires[i], false};
        wire_solution.push_back(w);
    }
    while (n > 0) {
        int i = n%3;
        int x = findWire();
        vector<string> pass;
        mt19937 gen(std::random_device{}());
        string s;
        switch (i)
        {
        case 0:
            // cut wire 
            // pick a random wire that hasn't been cut,
            // cut it, update solution
            if (x != -1) {
                wire_solution[x].first.cutWire();
                wire_solution[x].second = true;
                s = "Cut wire " + to_string(x);
                rules.push_back(s);
                n--;
            }
            break;
        case 1:
            // never cut a wire
            // pick a random wire that hasn't been cut, 
            // mark it as cannot bet cut
            if (x != -1) {
                wire_solution[x].second = true;
                s = "Never cut wire " + to_string(x);
                rules.push_back(s);
                n--;
            }
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
        default:
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

    random_device rd;                   // 1
    mt19937 gen(rd());                  // 2
    uniform_int_distribution<> dist(0, wires.size()-1); // 3
    int z = dist(gen);
    return wires[z];
}

string solution::pickColor(vector<string> colors) {
    mt19937 gen(std::random_device{}());
    uniform_int_distribution<> dist(0, colors.size()-1);
    return colors[dist(gen)];
}