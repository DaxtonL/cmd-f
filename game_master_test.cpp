#include <cassert>
#include <iostream>
#include <string>
#include <vector>
#include <map>

#include "game_master.h"
#include "bomb.h"
#include "player.h"

using namespace std;

void test_init_sets_basic_state() {
    game_master gm;
    gm.innit(60, 3);

    assert(gm.getTimer() == 60);
    assert(!gm.isGameOver());
    assert(!gm.isDefused());
    assert(!gm.isExploded());

    cout << "test_init_sets_basic_state passed\n";
}

void test_init_creates_right_number_of_players() {
    game_master gm;
    gm.innit(60, 3);

    vector<player> players = gm.getPlayers();
    assert(players.size() == 3);

    cout << "test_init_creates_right_number_of_players passed\n";
}

void test_player_names_are_assigned() {
    game_master gm;
    gm.innit(60, 3);

    vector<player> players = gm.getPlayers();
    assert(players[0].getName() == "Player 1");
    assert(players[1].getName() == "Player 2");
    assert(players[2].getName() == "Player 3");

    cout << "test_player_names_are_assigned passed\n";
}

void test_reinit_replaces_old_state() {
    game_master gm;
    gm.innit(60, 5);
    assert(gm.getPlayers().size() == 5);

    gm.innit(30, 2);
    assert(gm.getTimer() == 30);
    assert(gm.getPlayers().size() == 2);
    assert(!gm.isGameOver());
    assert(!gm.isDefused());
    assert(!gm.isExploded());

    cout << "test_reinit_replaces_old_state passed\n";
}

void test_cut_wire_invalid_index_returns_false() {
    game_master gm;
    gm.innit(60, 3);

    bool ok = gm.cutWire(999);
    assert(ok == false);

    cout << "test_cut_wire_invalid_index_returns_false passed\n";
}

void test_get_bomb_has_expected_sizes() {
    game_master gm;
    gm.innit(60, 3);

    bomb b = gm.getBomb();

    assert(b.getWires().size() == 5);
    assert(b.getToggles().size() == 3);
    assert(b.getButtons().size() == 4);

    cout << "test_get_bomb_has_expected_sizes passed\n";
}

void test_invalid_toggle_does_not_crash_or_change_count() {
    game_master gm;
    gm.innit(60, 3);

    bomb before = gm.getBomb();
    size_t toggle_count_before = before.getToggles().size();

    gm.flipToggle("not_a_real_toggle");

    bomb after = gm.getBomb();
    size_t toggle_count_after = after.getToggles().size();

    assert(toggle_count_before == toggle_count_after);

    cout << "test_invalid_toggle_does_not_crash_or_change_count passed\n";
}

void test_invalid_button_does_not_crash_or_change_count() {
    game_master gm;
    gm.innit(60, 3);

    bomb before = gm.getBomb();
    size_t button_count_before = before.getButtons().size();
    size_t password_size_before = before.getPassword().size();

    gm.pressButton("not_a_real_button");

    bomb after = gm.getBomb();
    size_t button_count_after = after.getButtons().size();
    size_t password_size_after = after.getPassword().size();

    assert(button_count_before == button_count_after);
    assert(password_size_before == password_size_after);

    cout << "test_invalid_button_does_not_crash_or_change_count passed\n";
}

int main() {
    test_init_sets_basic_state();
    test_init_creates_right_number_of_players();
    test_player_names_are_assigned();
    test_reinit_replaces_old_state();
    test_cut_wire_invalid_index_returns_false();
    test_get_bomb_has_expected_sizes();
    test_invalid_toggle_does_not_crash_or_change_count();
    test_invalid_button_does_not_crash_or_change_count();

    cout << "\nAll game_master tests passed.\n";
    return 0;
}