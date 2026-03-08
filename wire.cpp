#include <string>
#include "wire.h"
using namespace std;

wire::wire() {
    color = "NO SET COLOR";
    cut = false;
}

void wire::cutWire() {
    cut = true;
}

bool wire::getIscut() {
    return cut;
}

void wire::setColor(string s) {
    color = s;
}

string wire::getColor() {
    return color;
}