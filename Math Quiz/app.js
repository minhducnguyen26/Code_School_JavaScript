/*  DOM == Document Object Model 
    DOM allows you to manipulate everything on the website
    => Dynamic changes
    Hierachy structure (parents - children)
*/
var result;

function create_question() {
    var first_number  = document.querySelector(".first_number");
    var second_number = document.querySelector(".second_number");
    var operation     = document.querySelector(".operation");

    var first_number_value  = Math.floor(Math.random() * 100);
    var second_number_value = Math.floor(Math.random() * 100);

    var operation_list   = ["+", "-", "*", "/"];
    var random_operation = Math.floor(Math.random() * operation_list.length);
    var operation_value  = operation_list[random_operation];

    first_number.innerHTML  = first_number_value;
    second_number.innerHTML = second_number_value;
    operation.innerHTML     = operation_value;

    result = calculation(first_number.innerHTML, second_number.innerHTML, operation.innerHTML);
}
create_question();

function calculation(first_number, second_number, operation) {
    var correct_answer;

    if (operation == "+") {
        correct_answer = parseInt(first_number) + parseInt(second_number);
    } else if (operation == "-") {
        correct_answer = parseInt(first_number) - parseInt(second_number);
    } else if (operation == "*") {
        correct_answer = parseInt(first_number) * parseInt(second_number);
    } else if (operation == "/") {
        correct_answer = parseInt(first_number) / parseInt(second_number);
    }
    return Math.round(correct_answer);
}

function right_answer() {
    var response = document.querySelector(".response");
    response.innerHTML = "Got it!";
    response.style.display = "block";
    response.style.backgroundColor = "green";
    response.style.color = "white";
}

function wrong_answer() {
    var response = document.querySelector(".response");
    response.innerHTML = "Try again";
    response.style.display = "block";
    response.style.backgroundColor = "red";
    response.style.color = "white";
}

function no_answer() {
    var response = document.querySelector(".response");
    response.innerHTML = "Type your answer";
    response.style.display = "block";
    response.style.backgroundColor = "yellow";
    response.style.color = "black";
}

var check_answer_button = document.querySelector("#submit_answer");
check_answer_button.onclick = function() {
    var answer_input = document.querySelector("#answer_field").value;

    if (answer_input == result) {
        right_answer();
    } else if (answer_input == "") {
        no_answer();
    } else {
        wrong_answer();
    }
}