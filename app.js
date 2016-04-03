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
    })
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
    $scope.clean();

    if ($event.keyCode == 38) {
      $scope.moveUp();
    }
    else if ($event.keyCode == 39) {
      $scope.moveRight();
    }
    else if ($event.keyCode == 40) {
      $scope.moveDown();
    }
    else if ($event.keyCode == 37) {
      $scope.moveLeft();
    } else {
      return;
    }

    $scope.randomNew();
    $scope.calcScore();
  }

  $scope.moveLeft = function () {
    var rows = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      rows[tile.row][tile.column] = tile;
    });

    rows.forEach(function (row) {
      var index = 0;
      var pointer = null;

      for (var i =0; i < 4; i++) {
        if (row[i]) { //for every legitimate value...
          var dup = false; //if this element's value is equal to a stored 'val', it is a mergeable duplicate
          if (pointer && row[i].value == pointer.value) { 
          //allows the duplicate element to reside in the same location as its partner
            row[i].new = true;
            row[i].value *= 2;
            pointer.garbage = true;
            index--;
            dup = true;
          }

          pointer = row[i];

          if (dup) {
          //if this duplication merging has occured, the temporary 'val' is set to null,
          //so that only pairs only(and not triples) will be merged
            pointer = null;
          }

          row[i].column = index;
          index++;
        }
      }
    });
  }

  $scope.moveRight = function () {
    var rows = [[],[],[],[]];

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

          row[i].column = index;
          index--;
        }
      }
    });
  }

  $scope.moveUp = function () {
    var columns = [[],[],[],[]];

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

          column[i].row = index;
          index++;
        }
      }
    });
  }

  $scope.moveDown = function () {
    var columns = [[],[],[],[]];

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

          column[i].row = index;
          index--;
        }
      }
    }); 
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