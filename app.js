var app = angular.module('app',[]);

app.controller('controller', function ($scope){

  $scope.tiles = []

  for (var i =0; i < 4 ; i++ ){
    $scope.tiles.push(new Tile(0,i,1));
  }
  for (var i =0; i < 4 ; i++ ){
    $scope.tiles.push(new Tile(1,i,1));
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