var app = angular.module('app',[]);

app.controller('controller', function ($scope){

  $scope.tiles = []


  var x = new Tile(0,1,1);
  var y = new Tile(0,3,1);
  var a = new Tile(0,2,1);
  var b = new Tile(0,0,1);

  $scope.tiles.push(x,y,a,b);

  $scope.test = function () {
    var rows = [[],[],[],[]];

    $scope.tiles.forEach(function (tile) {
      rows[tile.row].push(tile);
    });

    rows.forEach(function (row) {
      var tempRow = [];
      for (var i =0; i < row.length; i++) {
        tempRow[row[i].column] = row[i]
      }
      var index = 0;
      var val;
      for (var j =0; j < 4; j++) {
        if (tempRow[j]) {
          var dup = false;
          if (tempRow[j].value == val) {
            index--;
            dup = true;
          }
          val = tempRow[j].value;
          if (dup) {
            val = null;
          }
          tempRow[j].column = index;
          index++;
        }
      }

    })

  }






});


function Tile (r,c,v) {
  this.row = r;
  this.column = c;
  this.value = v;
  this.class = function () {
    return 'r' + this.row + ' c' + this.column;
  }
}