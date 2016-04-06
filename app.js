var app = angular.module('app',['ngAnimate']);

app.controller('controller', function ($scope){

  $scope.tiles = [];
  $scope.score = 0;
  $scope.highScore = 0;

  $scope.calcScore = function () {
    $scope.tiles.forEach(function (tile) {
      if (tile.new) {
        $scope.score += tile.value;
      }
    });
    if ($scope.score >= $scope.highScore) {
      $scope.highScore = $scope.score;
    }
  }

  $scope.clean = function () {
    $scope.tiles = $scope.tiles.filter(function (tile) {
      return tile.garbage ? false : true;
    });
    $scope.tiles.forEach(function (tile) {
      tile.new = false;
    });
  }

  $scope.randomNew = function () {

    if ($scope.tiles.length == 16) {
      $scope.clean();
      return;
    }

    var newTile;
    do {
      newTile = generate();
    }
    while (!isValid());

    $scope.tiles.push(newTile);

    function generate () {
      return new Tile(Math.floor(Math.random()*4), Math.floor(Math.random()*4), 2);
    }
    function isValid() {
      var repeat = false;
      $scope.tiles.forEach(function (tile) {
        if (tile.row == newTile.row && tile.column == newTile.column) {
          repeat = true;
        }
      });
      return repeat ? false : true;
    }
  }

  $scope.movement = function ($event) {

    var moved = false;
    $scope.clean();

    if ($event.keyCode == 38) {
      // moved = $scope.moveUp() ? true : false;
      moved = $scope.move('up') ? true : false;
    }
    else if ($event.keyCode == 39) {
      // moved = $scope.moveRight() ? true : false;
      moved = $scope.move('right') ? true : false;
    }
    else if ($event.keyCode == 40) {
      // moved = $scope.moveDown() ? true : false;
      moved = $scope.move('down') ? true : false;
    }
    else if ($event.keyCode == 37) {
      // moved = $scope.moveLeft() ? true : false;
      moved = $scope.move('left') ? true : false;
    } else {
      return;
    }

    if (moved) {
      $scope.randomNew();
    }
    $scope.calcScore();
  }

  $scope.move = function (command) {

    // axis: true means horizontal (x-axis), false means vertical (y-axis)
    // direction: true means positive (down or right), false means negative (up or left)

    var axis;
    var direction;

    if (command == 'left') {
      axis = true;
      direction = false;
    } else if (command == 'right') {
      axis = true;
      direction = true;
    } else if (command == 'up') {
      axis = false;
      direction = false;
    } else if (command == 'down') {
      axis = false;
      direction = true;
    } else {
      return;
    }

    var firstDivision = [[],[],[],[]];
    var changed = false;

    $scope.tiles.forEach(function (tile) { //this orders the $scope.tiles into their initial board division
      if (axis) {
        firstDivision[tile.row][tile.column] = tile;
      } else {
        firstDivision[tile.column][tile.row] = tile;
      }
    });

    firstDivision.forEach(function (divided) {
      var index = direction ? 3 : 0;
      var pointer = null;
      var dividedCross = axis ? 'column' : 'row';

      var i = direction ? 3 : 0; 

      for ( i ; direction ? i >= 0 : i < 4 ; direction ? i-- : i++) {
        if (divided[i]) { 
          var dup = false; 
          if (pointer && divided[i].value == pointer.value) { 
          // if the value of the element in question is equal to that of the 
          // stored 'pointer', it is a mergeable duplicate.
          // we set the current tile as new and mark the previous 'pointer' tile for garbage
            divided[i].new = true;
            divided[i].value *= 2;
            pointer.garbage = true;
            direction ? index++ : index--;
            dup = true;
          }

          pointer = divided[i];

          if (dup) {
          // if this duplication merging has occured, the temporary 'pointer' is set back to null,
          // so that only pairs only (and not triples) will be merged
            pointer = null;
          }

          if (divided[i][dividedCross] != index) {
          // if this is ever called (which will happen more often than not), it means that
          // a tile has been moved.
            changed = true;
          }
          divided[i][dividedCross] = index;
          direction ? index-- : index++;
        }
      }
    });
    return changed;
  }

  $scope.reset = function () {
    $scope.tiles = [];
    $scope.score = 0;
    $scope.randomNew();
    $scope.randomNew();
  };
  $scope.reset();

});

function Tile (row, column, value) {
  this.row = row;
  this.column = column;
  this.value = value;
  this.garbage = false;
  this.new = false;
  this.class = function () {
    var extra = ''
    if (this.new) {
      extra = ' new';
    }
    return 'r' + this.row + ' c' + this.column + ' v' + this.value + extra;
  }
}