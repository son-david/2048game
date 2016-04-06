var app = angular.module('app',['ngAnimate'])
  .controller('controller', gameController);

function gameController (){

  var vm = this;

  vm.tiles = [];
  vm.score = 0;
  vm.highScore = 0;

  vm.calcScore = function () {
    vm.tiles.forEach(function (tile) {
      if (tile.new) {
        vm.score += tile.value;
      }
    });
    if (vm.score >= vm.highScore) {
      vm.highScore = vm.score;
    }
  }

  vm.clean = function () {
    vm.tiles = vm.tiles.filter(function (tile) {
      return tile.garbage ? false : true;
    });
    vm.tiles.forEach(function (tile) {
      tile.new = false;
    });
  }

  vm.randomNew = function () {

    if (vm.tiles.length === 16) {
      vm.clean();
      return;
    }

    var newTile;
    do {
      newTile = generate();
    }
    while (!isValid());

    vm.tiles.push(newTile);

    function generate () {
      return new Tile(Math.floor(Math.random()*4), Math.floor(Math.random()*4), 2);
    }
    function isValid() {
      var repeat = false;
      vm.tiles.forEach(function (tile) {
        if (tile.row === newTile.row && tile.column === newTile.column) {
          repeat = true;
        }
      });
      return repeat ? false : true;
    }
  }

  vm.movement = function ($event) {

    var moved = false;
    vm.clean();

    switch($event.keyCode) {
      case 38:
        moved = vm.move('up') ? true : false;
        break;
      case 39:
        moved = vm.move('right') ? true : false;
        break;
      case 40:
        moved = vm.move('down') ? true : false;
        break;
      case 37:
        moved = vm.move('left') ? true : false;
        break;
    }

    if (moved) {
      vm.randomNew();
    }
    vm.calcScore();
  }

  vm.move = function (command) {

    // axis: true means horizontal (x-axis), false means vertical (y-axis)
    // direction: true means positive (down or right), false means negative (up or left)

    var axis;
    var direction;

    switch(command) {
      case 'left':
        axis = true;
        direction = false;
        break;
      case 'right':
        axis = true;
        direction = true;
        break;
      case 'up':
        axis = false;
        direction = false;
        break;
      case 'down':
        axis = false;
        direction = true;
        break;
    }

    var firstDivision = [[],[],[],[]];
    var changed = false;

    vm.tiles.forEach(function (tile) { //this orders the vm.tiles into their initial board division
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
          if (pointer && divided[i].value === pointer.value) { 
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

  vm.reset = function () {
    vm.tiles = [];
    vm.score = 0;
    vm.randomNew();
    vm.randomNew();
  };
  vm.reset();
}

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