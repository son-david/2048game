var app = angular.module('app',['ngAnimate']);

app.controller('controller', function ($scope){

  $scope.tiles = [];
  $scope.score = 123;

  $scope.clean = function () {

    $scope.tiles = $scope.tiles.filter(function (tile) {
      return tile.garbage ? false : true;
    });
    $scope.tiles.forEach(function (tile) {
      tile.new = false;
    })
  }

  $scope.randomNew = function () {

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

  $scope.movement = function ($event) {
    if ($event.keyCode == 38) {
      $scope.moveUp();
      $scope.randomNew();      
    }
    else if ($event.keyCode == 39) {
      $scope.moveRight();
      $scope.randomNew();      
    }
    else if ($event.keyCode == 40) {
      $scope.moveDown();
      $scope.randomNew();      
    }
    else if ($event.keyCode == 37) {
      $scope.moveLeft();
      $scope.randomNew();      
    }
  }

  $scope.moveLeft = function () {
    $scope.clean();
    var rows = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      rows[tile.row].push(tile);
    });

    rows.forEach(function (row, rowIndex) {
      //initialize a tempRow to feed row values into proper order
      var tempRow = [];
      for (var i =0; i < row.length; i++) {
        tempRow[row[i].column] = row[i];
      }
      //
      var pointer = 0;
      var val = null;
      for (var j =0; j < 4; j++) {
        if (tempRow[j]) { //for every legitimate value...
          var dup = false; //if this element's value is equal to a stored 'val', it is a mergeable duplicate
          if (val && tempRow[j].value == val.value) { 
          //allows the duplicate element to reside in the same location as its partner
            tempRow[j].new = true;
            val.garbage = true;
            pointer--;
            dup = true;
          }

          val = tempRow[j];

          if (dup) {
          //if this duplication merging has occured, the temporary 'val' is set to null,
          //so that only pairs only(and not triples) will be merged
            tempRow[j].value *= 2;
            val = null;
          }

          tempRow[j].column = pointer;
          pointer++;
        }
      }
    });
  }

  $scope.moveRight = function () {
    
    $scope.clean();
    var rows = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      rows[tile.row].push(tile);
    });

    rows.forEach(function (row, rowIndex) {
      //initialize a tempRow to feed row values into proper order
      var tempRow = [];
      for (var i =0; i < row.length; i++) {
        tempRow[row[i].column] = row[i];
      }
      //
      var pointer = 3;
      var val = null;
      for (var j = 3; j >= 0; j--) {
        if (tempRow[j]) { //for every legitimate value...
          var dup = false; //if this element's value is equal to a stored 'val', it is a mergeable duplicate
          if (val && tempRow[j].value == val.value) { 
          //allows the duplicate element to reside in the same location as its partner
            tempRow[j].new = true;
            val.garbage = true;
            pointer++;
            dup = true;
          }

          val = tempRow[j];

          if (dup) {
          //if this duplication merging has occured, the temporary 'val' is set to null,
          //so that only pairs only(and not triples) will be merged
            // $scope.tiles.push(new Tile(rowIndex, pointer, val.value * 2));
            tempRow[j].value *= 2;
            val = null;
          }

          tempRow[j].column = pointer;
          pointer--;
        }
      }

    })

  }

  $scope.moveUp = function () {
    
    $scope.clean();
    var columns = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      columns[tile.column].push(tile);
    });

    columns.forEach(function (column, columnIndex) {
      var tempCol = [];
      for (var i = 0; i < column.length; i++) {
        tempCol[column[i].row] = column[i];
      }

      var pointer = 0;
      var val = null;
      for (var j =0; j < 4; j++) {
        if (tempCol[j]) { //for every legitimate value...
          var dup = false; //if this element's value is equal to a stored 'val', it is a mergeable duplicate
          if (val && tempCol[j].value == val.value) { 
          //allows the duplicate element to reside in the same location as its partner
            tempCol[j].new = true; 
            val.garbage = true;
            pointer--;
            dup = true;
          }

          val = tempCol[j];

          if (dup) {
          //if this duplication merging has occured, the temporary 'val' is set to null,
          //so that only pairs only(and not triples) will be merged
            // $scope.tiles.push(new Tile(pointer, columnIndex, val.value * 2));
            tempCol[j].value *= 2;
            val = null;
          }

          tempCol[j].row = pointer;
          pointer++;
        }
      }
    });
  }

  $scope.moveDown = function () {
    
    $scope.clean();
    var columns = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      columns[tile.column].push(tile);
    });

    columns.forEach(function (column, columnIndex) {
      var tempCol = [];
      for (var i = 0; i < column.length; i++) {
        tempCol[column[i].row] = column[i];
      }

      var pointer = 3;
      var val = null;
      for (var j = 3; j >= 0; j--) {
        if (tempCol[j]) { //for every legitimate value...
          var dup = false; //if this element's value is equal to a stored 'val', it is a mergeable duplicate
          if (val && tempCol[j].value == val.value) { 
          //allows the duplicate element to reside in the same location as its partner
            tempCol[j].new = true;
            val.garbage = true;
            pointer++;
            dup = true;
          }

          val = tempCol[j];

          if (dup) {
          //if this duplication merging has occured, the temporary 'val' is set to null,
          //so that only pairs only(and not triples) will be merged
            // $scope.tiles.push(new Tile(pointer, columnIndex, val.value * 2));
            tempCol[j].value *=2;
            val = null;
          }

          tempCol[j].row = pointer;
          pointer--;
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