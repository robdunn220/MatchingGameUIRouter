var app = angular.module('matching', ['ui.router']);

function Card(num) {
        this.image = 'images/monsters-' + num + '.png';
        this.back = ' ';
        this.open = false;
        this.matched = false;
    }

var cardsInit = ["01","02","03","04","05","06","07","08","09","10",
                "11","12","13","14","15","16"];

var winCounter = 0;
var table_setup = true;

var randomNumGen = function() {
    var random = Math.floor(Math.random() * cardsInit.length);
    return random;
};

app.controller('BoardRenderer', function($scope, $stateParams, $timeout) {
  table_setup = false;
  $scope.cards = [];
  var num = $stateParams.board_number;
  for (var j = 0; j < num / 2; j++) {
      var randArr = randomNumGen();
      if (cardsInit[randArr])
          $scope.cards.push(new Card(cardsInit[randArr]));
      $scope.cards.push(new Card(cardsInit[randArr]));
      cardsInit.splice(randArr, 1);
  }

  $scope.counter = 0;
  $scope.unclickable = false;
  $scope.flip = function(index) {
      if (!$scope.unclickable) {
          $scope.cards[index].open = true;
          if ($scope.counter === 0) {
              $scope.firstOpen = $scope.cards[index];
              $scope.indexOne = index;
              $scope.counter += 1;
          } else if ($scope.counter === 1) {
              $scope.unclickable = true;
              $scope.secondOpen = $scope.cards[index];
              $scope.counter += 1;

              if ($scope.firstOpen.image == $scope.secondOpen.image) {

                  $scope.indexTwo = index;
                  $scope.cards[$scope.indexOne].matched = true;
                  $scope.cards[$scope.indexTwo].matched = true;
                  $scope.checkWin();
                  $scope.unclickable = false;
              } else {
                  $scope.indexTwo = index;
                  $timeout(function() {
                      $scope.cards[$scope.indexOne].open = false;
                      $scope.cards[$scope.indexTwo].open = false;
                      $scope.unclickable = false;
                  }, 500);
              }
              if ($scope.counter === 2) {
                  $scope.counter = 0;
              }
          }
      }

      $scope.checkWin = function() {
          $scope.winCounter += 2;
          if ($scope.winCounter === $scope.cards.length) {
              $timeout(function() {
                  alert("You Win!");
              }, 500);
          }
      };
  };
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: 'home',
    url: '/',
    templateUrl: 'home.html'
  })
  .state({
    name: 'board',
    url: '/{board_number}',
    templateUrl: 'board.html',
    controller: 'BoardRenderer'
  });
});
