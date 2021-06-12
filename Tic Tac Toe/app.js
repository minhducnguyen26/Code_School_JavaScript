var player_turn = 0;

function player_move() {
    var all_tiles = document.querySelectorAll(".box");
    var player_box_x = document.querySelector(".player_box_1");
    var player_box_o = document.querySelector(".player_box_2");

    // for tile in all_tiles:
    all_tiles.forEach(function(tile) {
        tile.onclick = function() {
            if (tile.innerHTML == "") {
                if (player_turn == 0) {
                    tile.innerHTML = "X";
                    tile.classList.add("x_turn");

                    player_box_x.classList.remove("player_x");
                    player_box_o.classList.add("player_o");

                    if ( check_for_winner("x_turn") ) {
                        console.log("Player X won!");
                        reset_game();
                    }
                    
                    player_turn = 1;
                } else {
                    tile.innerHTML = "O";
                    tile.classList.add("o_turn");

                    player_box_x.classList.add("player_x");
                    player_box_o.classList.remove("player_o");

                    if ( check_for_winner("o_turn") ) {
                        console.log("Player O won!");
                        reset_game();
                    }

                    player_turn = 0;
                }
            }
            tile.classList.add("box_filled");
        }
    });
}
player_move();

function check_for_winner(player) {
    var winner = false;

    var groups = ["row_1", "row_2", "row_3",
                  "col_1", "col_2", "col3", 
                  "diag_1", "diag_2"];
                  
    groups.forEach(function(group) {
        var selector = "." + group + "." + player;
        
        if(document.querySelectorAll(selector).length == 3) {
            winner = true;
        }
    });

    return winner;
}

function reset_game() {
    var all_tiles = document.querySelectorAll(".box");
    all_tiles.forEach(function(tile) {
        tile.innerHTML = "";
        tile.classList.remove("x_turn", "o_turn");
    });
}