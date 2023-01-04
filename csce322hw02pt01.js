module.exports = {
  oneVehicleOneTurn: oneVehicleOneTurn
}

const {
  BlockList
} = require('net');
var helpers = require('./helpers');

function oneVehicleOneTurn(map) {

  var x = 0;
  var y = 0;
  var moved = false;
  var cannot_start = false;
  var current_turn = 'c';
  var one_move = false;
  var move_check = false;

  function find_vehicle() {

      var rows = map.length;
      var columns = map[0].length;

      for (var row = 0; row < rows; row++) {
          for (var column = 0; column < columns; column++) {
              if ((map[row][column] > 0) && (map[row][column] <= 9)) {
                  x = row;
                  y = column;
              }
          }
      }
  }

  function one_move_checker(){

    if (map[x - 1][y] == '-') {
        one_move = true;
    }
    if (map[x + 1][y] == '-') {
        one_move = true;
    }
    if (map[x][y - 1] == '-') {
        one_move = true;
    }
    if (map[x][y + 1] == '-') {
        one_move = true;
    }

    //console.log("One move called" +one_move );
    return one_move;
  }

  function dead_end_checker() {

      var blocked = 0;

      if (map[x - 1][y] == 'x') {
          blocked++;
      }
      if (map[x + 1][y] == 'x') {
          blocked++;
      }
      if (map[x][y - 1] == 'x') {
          blocked++;
      }
      if (map[x][y + 1] == 'x') {
          blocked++;
      }

      if (blocked >= 3) {
          return true;
      } else {
          return false;
      }
  }

  function decision_point_checker() {

      var roads = 0;

      if (map[x - 1][y] == '-') {
          roads++;
      }
      if (map[x + 1][y] == '-') {
          roads++;
      }
      if (map[x][y - 1] == '-') {
          roads++;
      }
      if (map[x][y + 1] == '-') {
          roads++;
      }

      if (roads >= 3) {
          return true;
      } else {
          return false;
      }
  }

  function stop_checker() {
    //console.log("called stop checker \n");
    // console.log("dead_end_checker() " + dead_end_checker());
    // console.log("decision_point_checker() " + decision_point_checker());
    // console.log("moved " + moved);
    // console.log("map[x][y] " + map[x][y] + " x " + x + " y " + y);
      if ((dead_end_checker() == true) || ((decision_point_checker() == true) && (moved == true))) {
          return true;
      } else {
          return false;
      }
  }

  function swap(i, j) {
      var temp = map[i][j];
      map[i][j] = map[x][y];
      map[x][y] = temp;
      x = i;
      y = j;
  }

  function continue_moving(turn) {
      if (moved == false) {
          current_turn = turn;
      }
      //console.log("continue moving called");
      //console.log("map[x][y] " + map[x][y] + " x " + x + " y " + y);
      if (current_turn == 'n') {
          if (map[x - 1][y] == 'x') {
              if (moved == false) {
                  cannot_start = true;
                  return;
              } else if (moved == true) {
                  if (map[x][y - 1] == '-') {
                      swap(x, y - 1);
                      current_turn = 'w';
                  } else if (map[x][y + 1] == '-') {
                      swap(x, y + 1);
                      current_turn = 'e';
                  }
              }
          } else {
              swap(x - 1, y);
          }
      }

      if (current_turn == 's') {
          if (map[x + 1][y] == 'x') {
              if (moved == false) {
                cannot_start = true;
                return;
              } else if (moved == true) {
                  if (map[x][y - 1] == '-') {
                      swap(x, y - 1);
                      current_turn = 'w';
                  } else if (map[x][y + 1] == '-') {
                      swap(x, y + 1);
                      current_turn = 'e';
                  }
              }
          } else {
              swap(x + 1, y);
          }
      }

      if (current_turn == 'w') {
          if (map[x][y - 1] == 'x') {
              if (moved == false) {
                cannot_start = true;
                return;
              } else if (moved == true) {
                  if (map[x - 1][y] == '-') {
                      swap(x - 1, y);
                      current_turn = 'n';
                  } else if (map[x + 1][y] == '-') {
                      swap(x + 1, y);
                      current_turn = 's';
                  }
              }
          } else {
              swap(x, y - 1);
          }
      }

      if (current_turn == 'e') {
          if (map[x][y + 1] == 'x') {
              if (moved == false) {
                cannot_start = true;
                return;
              } else if (moved == true) {
                  if (map[x - 1][y] == '-') {
                      swap(x - 1, y);
                      current_turn = 'n';
                  } else if (map[x + 1][y] == '-') {
                      swap(x + 1, y);
                      current_turn = 's';
                  }
              }
          } else {
              swap(x, y + 1);
          }
      }

      if (moved == false) {
          moved = true;
      }
      //console.log("After map[x][y] " + map[x][y] + " x " + x + " y " + y + " moved " + moved + "cannot start" + cannot_start);
      return;
  }

  function move_checker(turn) {
      move_check = one_move_checker();
      while (move_check == true) {
          
          if(moved == false){
              //console.log("first move");
            continue_moving(turn);
            if(cannot_start == true){
                return;
            }
            moved = true;
          } else if(moved == true){

              //console.log("entered else");
            //continue_moving(turn);
            if(stop_checker() == false){
               continue_moving(turn);
            }
           else if(stop_checker() == true){
            break;
            }
          }
        //   continue_moving(turn);
        //   //stop_checker();
        //   if(stop_checker() == true){
        //       return;
        //   }
        //   moved = true;
        //   if(cannot_start = true){
        //       return;
        //   }
        //   //cannot_start = false;
        move_check = one_move_checker();
      }
      return;
  }


  function master_function(turn) {

      find_vehicle();

      move_checker(turn);

      return map;
  }

  return master_function;
}