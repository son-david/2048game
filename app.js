var app = angular.module('app',['ngAnimate']);

app.controller('controller', function ($scope){

  $scope.tiles = [];
  $scope.score = 0;

  $scope.reset = function () {
    $scope.tiles = [];
    $scope.score = 0;
    $scope.randomNew();
    $scope.randomNew();
  }

  $scope.calcScore = function () {
    $scope.tiles.forEach(function (tile) {
      if (tile.new) {
        $scope.score += tile.value;
      }
    });
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

  $scope.randomNew();
  $scope.randomNew();
  $scope.clean();
  $scope.calcScore();

  $scope.movement = function ($event) {

    var moved = false;
    $scope.clean();

    if ($scope.tiles.length)

    if ($event.keyCode == 38) {
      moved = $scope.moveUp() ? true : false;
    }
    else if ($event.keyCode == 39) {
      moved = $scope.moveRight() ? true : false;
    }
    else if ($event.keyCode == 40) {
      moved = $scope.moveDown() ? true : false;
    }
    else if ($event.keyCode == 37) {
      moved = $scope.moveLeft() ? true : false;
    } else {
      return;
    }

    if (moved) {
      $scope.randomNew();
    }
    $scope.calcScore();
  }

  $scope.moveLeft = function () {
    var rows = [[],[],[],[]];
    var changed = false;

    $scope.tiles.forEach(function (tile) { //this orders the $scope.tiles into rows
      rows[tile.row][tile.column] = tile;
    });

    rows.forEach(function (row) {
      var index = 0;
      var pointer = null;

      for (var i =0; i < 4; i++) {
        if (row[i]) { 
          var dup = false; 
          if (pointer && row[i].value == pointer.value) { 
          // if the value of the element in question is equal to that of the 
          // stored 'pointer', it is a mergeable duplicate.
          // we set the current tile as new and mark the previous 'pointer' tile for garbage
            row[i].new = true;
            row[i].value *= 2;
            pointer.garbage = true;
            index--;
            dup = true;
          }

          pointer = row[i];

          if (dup) {
          // if this duplication merging has occured, the temporary 'pointer' is set back to null,
          // so that only pairs only (and not triples) will be merged
            pointer = null;
          }

          if (row[i].column != index) {
          // if this is ever called (which will happen more often than not), it means that
          // a tile has been moved.
            changed = true;
          }
          row[i].column = index;

          index++;
        }
      }
    });
    return changed;
  }

  $scope.moveRight = function () {
    var rows = [[],[],[],[]];
    var changed = false;

    $scope.tiles.forEach(function (tile) {
      rows[tile.row][tile.column] = tile;
    });

    rows.forEach(function (row) {
      var index = 3;
      var pointer = null;

      for (var i = 3; i >= 0; i--) {
        if (row[i]) {
          var dup = false; 
          if (pointer && row[i].value == pointer.value) { 
            row[i].new = true;
            row[i].value *= 2;
            pointer.garbage = true;
            index++;
            dup = true;
          }

          pointer = row[i];

          if (dup) {
            pointer = null;
          }
          if (row[i].column != index) {
            changed = true;
          }

          row[i].column = index;
          index--;
        }
      }
    });
    return changed;
  }

  $scope.moveUp = function () {
    var columns = [[],[],[],[]];
    var changed = false;

    $scope.tiles.forEach(function (tile) {
      columns[tile.column][tile.row] = tile;
    });

    columns.forEach(function (column) {
      var index = 0;
      var pointer = null;

      for (var i =0; i < 4; i++) {
        if (column[i]) { 
          var dup = false;
          if (pointer && column[i].value == pointer.value) { 
            column[i].new = true; 
            column[i].value *= 2;
            pointer.garbage = true;
            index--;
            dup = true;
          }

          pointer = column[i];

          if (dup) {
            pointer = null;
          }
          if (column[i].row != index) {
            changed = true;
          }

          column[i].row = index;
          index++;
        }
      }
    });
    return changed;
  }

  $scope.moveDown = function () {
    var columns = [[],[],[],[]];
    var changed = false;

    $scope.tiles.forEach(function (tile) {
      columns[tile.column][tile.row] = tile;
    });

    columns.forEach(function (column) {
      var index = 3;
      var pointer = null;
      for (var i = 3; i >= 0; i--) {
        if (column[i]) {
          var dup = false; 
          if (pointer && column[i].value == pointer.value) {
            column[i].new = true;
            column[i].value *=2;
            pointer.garbage = true;
            index++;
            dup = true;
          }

          pointer = column[i];

          if (dup) {
            pointer = null;
          }
          if (column[i].row != index) {
            changed = true;
          }

          column[i].row = index;
          index--;
        }
      }
    }); 
    return changed;
  }

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