var board_data = {};

function tile_key(row, column) {
    return "row" + row + "_col" + column;
}

`GAME SET UP`
function create_board() {
    var game_board = document.querySelector(".game_board");

    // for i in range(4)
    for (var row = 0; row < 4; row++) {
        var row_div = document.createElement("div");
        row_div.classList.add("row");
        game_board.appendChild(row_div);

        for (var column = 0; column < 4; column++) {
            // create new tiles
            var key = tile_key(row, column);
            var tile_div = document.createElement("div");
            tile_div.id = key;
            tile_div.classList.add("tile");
            row_div.appendChild(tile_div);
        }
    }
}

function update_board() {
    for (var row = 0; row < 4; row++) {
        for (var column = 0; column < 4; column++) {
            var key   = tile_key(row, column);
            var value = board_data[key];

            var tile_div = document.querySelector("#" + key);
            tile_div.className = "tile";

            if (value) {
                tile_div.innerHTML = value;
                tile_div.classList.add("tile_" + value);
            } else {
                tile_div.innerHTML = "";
            }
        }
    }
}

function get_empty_tiles() {
    var empty_tiles = [];

    for (var row = 0; row < 4; row++) {
        for (var column = 0; column < 4; column++) {
            var key   = tile_key(row, column);
            var value = board_data[key];

            if (!value) {
                empty_tiles.push(key);
            }
        }
    }

    return empty_tiles;
}

function generate_random_tile() {
    var empty_tiles = get_empty_tiles();

    var random_index = Math.floor(Math.random() * empty_tiles.length);

    var random_tile_key = empty_tiles[random_index];

    if (random_tile_key) {
        // 10% chance of getting a number 4
        if (Math.random() < 0.1) {
            board_data[random_tile_key] = 4;
        } else {
            board_data[random_tile_key] = 2;
        }
    }
}

function combine_tiles(numbers) {
    // Assume numbers is a list containing only numbers (no blanks)
    var new_numbers = [];
    var score = 0;

    // While there are still numbers in the input list
    while (numbers.length > 0) {
        // if only one number in the input list
        if (numbers.length == 1) {
            // add the number to the new list
            new_numbers.push(numbers[0]);
            // remove the number from the input list
            numbers.splice(0, 1);
        }
        // if there are two numbers and they match
        else if (numbers[0] == numbers[1]) {
            //  add them up
            var sum = numbers[0] + numbers[1];
            score += sum;
            // add the combined number to the new list
            new_numbers.push(sum);
            // remove both numbers from the input list
            numbers.splice(0, 2);
        } 
        // if there are two numbers but they don't match
        else {
            // add the first number to the new list
            new_numbers.push(numbers[0]);
            // remove the first number from the input list
            numbers.splice(0, 1);
        }
    }

    // Restore blanks (pad end of new_numbers)
    while (new_numbers.length < 4) {
        new_numbers.push(undefined);
    }

    if (score) {
        update_score(score);
        add_score_animation(score);
    }

    return new_numbers;
}

`DEAL WITH ROWS`
function get_numbers_in_row(row) {
    var numbers = [];

    for (var column = 0; column < 4; column++) {
        var key = tile_key(row, column);
        var value = board_data[key];

        if (value) {
            // Skip blanks
            numbers.push(value);
        }
    }

    return numbers;
}

function set_numbers_in_row(row, new_numbers) {
    for (var column = 0; column < 4; column++) {
        var key = tile_key(row, column);
        var value = new_numbers[column];

        board_data[key] = value;
    }
}

`DEAL WITH COLUMNS`
function get_numbers_in_column(column) {
    var numbers = [];

    for (var row = 0; row < 4; row++) {
        var key = tile_key(row, column);
        var value = board_data[key];

        if (value) {
            // Skip blanks
            numbers.push(value);
        }
    }

    return numbers;
}

function set_numbers_in_column(column, new_numbers) {
    for (var row = 0; row < 4; row++) {
        var key = tile_key(row, column);
        var value = new_numbers[row];

        board_data[key] = value;
    }
}

`COMBINE ROWS`
function combine_row_left(row) {
    var numbers = get_numbers_in_row(row);
    var new_numbers = combine_tiles(numbers);
    set_numbers_in_row(row, new_numbers);
}

function combine_row_right(row) {
    var numbers = get_numbers_in_row(row);
    numbers.reverse();

    var new_numbers = combine_tiles(numbers);
    new_numbers.reverse();

    set_numbers_in_row(row, new_numbers);
}

`COMBINE COLUMNS`
function combine_column_up(column) {
    var numbers = get_numbers_in_column(column);
    var new_numbers = combine_tiles(numbers);
    set_numbers_in_column(column, new_numbers);
}

function combine_column_down(column) {
    var numbers = get_numbers_in_column(column);
    numbers.reverse();

    var new_numbers = combine_tiles(numbers);
    new_numbers.reverse();

    set_numbers_in_column(column, new_numbers);
}

`COMBINE DIRECTION`
function combine_direction(direction) {
    // Copy the board data into a new variable
    var old_board = Object.assign({}, board_data)

    for (var i = 0; i < 4; i++) {
        if (direction == "left") {
            combine_row_left(i);
        } else if (direction == "right") {
            combine_row_right(i);
        } else if (direction == "up") {
            combine_column_up(i);
        } else if (direction == "down") {
            combine_column_down(i);
        }
    }
    
    if ( did_board_change(old_board) ) {
        generate_random_tile();
        update_board();
    } else {
        check_for_game_over( get_empty_tiles() );
    }

    save_game();
}

`HANDLE KEYDOWN EVENT`
document.addEventListener('keydown', press);
function press(e){
    if (e.keyCode === 87) {
        // Press on W
        combine_direction("up");
    } if (e.keyCode === 68) {
        // Press on D
        combine_direction("right");
    } if (e.keyCode === 83) {
        // Press on S
        combine_direction("down");
    } if (e.keyCode === 65) {
        // Press on A
        combine_direction("left");
    }
}

`GAME FUNCTIONS`
function did_board_change(old_board) {
    var changed = false;

    for (var row = 0; row < 4; row++) {
        for (var column = 0; column < 4; column++) {
            var key = tile_key(row, column);

            if (old_board[key] != board_data[key]) {
                changed = true;
            }

        }
    }

    return changed;
}

function add_score_animation(score) {
    var add_score = document.querySelector(".add_score");
    add_score.innerHTML = "+" + score;
    if (add_score.classList.contains("add_score_animation")) {
        add_score.classList.remove("add_score_animation");
    } else {
        add_score.classList.add("add_score_animation");
    }
}

function update_score(score) {
    var current_score = document.querySelector(".current_score").innerHTML;
    var calculate_new_score = parseInt(current_score) + score;

    var update_current_score = document.querySelector(".current_score");
    update_current_score.innerHTML = calculate_new_score;
}

function save_best_score() {
    var current_score = document.querySelector(".current_score");
    var best_score    = document.querySelector(".best_score");

    var current_score_value = parseInt(current_score.innerHTML);
    var best_score_value    = parseInt(best_score.innerHTML);

    if (current_score_value > best_score_value) {
        best_score.innerHTML = current_score_value;
    }
}

function check_for_game_over(empty_tiles) {
    if(empty_tiles.length == 0) {
        var game_over_display = document.querySelector(".game_over_display");
        game_over_display.style.display = "flex";
    }
}

function start_new_game() {
    board_data = {};

    var current_score = document.querySelector(".current_score");
    current_score.innerHTML = "0";

    generate_random_tile();
    generate_random_tile();
    update_board();
}

function reset_game_buttons() {
    var new_game_button = document.querySelector(".new_game");
    new_game_button.onclick = function() {
        save_best_score();
        start_new_game();
    }

    var try_again_button = document.querySelector(".try_again");
    try_again_button.onclick = function() {
        var game_over_display = document.querySelector(".game_over_display");
        game_over_display.style.display = "none";
        save_best_score();
        start_new_game();
    }
}

function show_submit_score_screen() {
    var submit_score_screen = document.querySelector(".submit_score_screen");
    var submit_score_button = document.querySelector(".submit_score");
    var go_back_button      = document.querySelector(".go_back_from_submit_score");

    var leaderboard_screen = document.querySelector(".leaderboard_screen");
    var leaderboard_button = document.querySelector(".leaderboard_button");
    var go_back_from_leaderboard = document.querySelector(".go_back_from_leaderboard");

    submit_score_button.onclick = function() {
        submit_score_screen.style.display  = "flex";
        submit_score_button.style.display  = "none";
        go_back_button.style.display       = "block";

        leaderboard_screen.style.display = "none";
        leaderboard_button.style.display = "block";
        go_back_from_leaderboard.style.display = "none";
    }

    var submit_player_score = document.querySelector(".submit");
    submit_player_score.onclick = function() {
        save_score_to_server();
        var player_name   = document.querySelector(".enter_player_name");
        player_name.value = "";
    }
}

function hide_submit_score_screen() {
    var submit_score_screen = document.querySelector(".submit_score_screen");
    var submit_score_button = document.querySelector(".submit_score");
    var go_back_button      = document.querySelector(".go_back_from_submit_score");

    var leaderboard_screen = document.querySelector(".leaderboard_screen");
    var leaderboard_button = document.querySelector(".leaderboard_button");
    var go_back_from_leaderboard = document.querySelector(".go_back_from_leaderboard");
    
    go_back_button.onclick = function() {
        submit_score_screen.style.display  = "none";
        submit_score_button.style.display  = "block";
        go_back_button.style.display       = "none";

        leaderboard_screen.style.display = "none";
        leaderboard_button.style.display = "block";
        go_back_from_leaderboard.style.display = "none";
    }
}

function show_leaderboard_screen() {
    var leaderboard_screen = document.querySelector(".leaderboard_screen");
    var leaderboard_button = document.querySelector(".leaderboard_button");
    var go_back_button     = document.querySelector(".go_back_from_leaderboard");

    var submit_score_screen = document.querySelector(".submit_score_screen");
    var submit_score_button = document.querySelector(".submit_score");
    var go_back_from_submit_score = document.querySelector(".go_back_from_submit_score");
    
    leaderboard_button.onclick = function() {
        leaderboard_screen.style.display = "block";
        leaderboard_button.style.display = "none";
        go_back_button.style.display     = "block";

        submit_score_screen.style.display = "none";
        submit_score_button.style.display = "block";
        go_back_from_submit_score.style.display = "none";
    }

    get_scores_from_server();
}

function hide_leaderboard_screen() {
    var leaderboard_screen = document.querySelector(".leaderboard_screen");
    var leaderboard_button = document.querySelector(".leaderboard_button");
    var go_back_button     = document.querySelector(".go_back_from_leaderboard");
    
    var submit_score_screen = document.querySelector(".submit_score_screen");
    var submit_score_button = document.querySelector(".submit_score");
    var go_back_from_submit_score = document.querySelector(".go_back_from_submit_score");

    go_back_button.onclick = function() {
        leaderboard_screen.style.display = "none";
        leaderboard_button.style.display = "block";
        go_back_button.style.display     = "none";

        submit_score_screen.style.display = "none";
        submit_score_button.style.display = "block";
        go_back_from_submit_score.style.display = "none";
    }
}

function submit_score_and_leaderboad_actions() {
    show_submit_score_screen();
    hide_submit_score_screen();
    show_leaderboard_screen();
    hide_leaderboard_screen();
}

function get_scores_from_server() {
    fetch("https://highscoreapi.herokuapp.com/scores").then(
        function(response) {
            // this function runs in the FUTURE
            response.json().then(
                function(data) {
                    var leaderboard_table = document.querySelector(".leaderboard_screen");

                    // delete all rows
                    var row_count = leaderboard_table.rows.length;
                    for (var i = row_count - 1; i > 0; i--) {
                       leaderboard_table.deleteRow(i);
                    }

                    var count = 1;
                    data.forEach( function(player_info) {
                        // Add new row at the end of the table
                        var new_row  = leaderboard_table.insertRow(-1);

                        // Create 3 cells in a row
                        var rank_cell  = new_row.insertCell(0);
                        var name_cell  = new_row.insertCell(1);
                        var score_cell = new_row.insertCell(2);

                        // Assign value to each cell
                        var rank = document.createTextNode(count);
                        rank_cell.classList.add("player_rank");
                        rank_cell.appendChild(rank);
                        count += 1;

                        var name = document.createTextNode(player_info.name);
                        name_cell.classList.add("player_name");
                        name_cell.appendChild(name);

                        var score = document.createTextNode(player_info.score);
                        score_cell.classList.add("player_score");
                        score_cell.appendChild(score);
                    })
                }
            )
        }
    );
}

function save_score_to_server() {
    var player_name   = document.querySelector(".enter_player_name").value;
    var current_score = document.querySelector(".current_score").innerHTML;

    var data = {
        "name" : player_name,
        "score": current_score
    }

    fetch("https://highscoreapi.herokuapp.com/scores", {
        // options for fetch
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    }).then(function(response) {
        // response handler function
        console.log("Successfully submitted score to server");
    });
}

function save_game() {
    var current_score = document.querySelector(".current_score").innerHTML;
    localStorage.setItem("current_score", current_score);
    localStorage.setItem("board_data", JSON.stringify(board_data));
}

function load_game() {
    var current_score = document.querySelector(".current_score");
    current_score.innerHTML = parseInt(localStorage.getItem("current_score"), 10);
    board_data = JSON.parse(localStorage.getItem("board_data"));
    update_board();
}

`MAIN FUNCTION`
function game_play(){
    create_board();

    if (localStorage.getItem("current_score")) {
        load_game();
    } else {
        start_new_game();
    }
    
    reset_game_buttons();
    submit_score_and_leaderboad_actions();
}

game_play();