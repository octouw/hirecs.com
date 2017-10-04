var d = new Date().getTime();
var eventDates = [
  new Date(2017, 9, 5).getTime(),
  new Date(2017, 9, 5).getTime(),
  new Date(2017, 9, 6).getTime(),
  new Date(2017, 9, 10).getTime(),
  new Date(2017, 9, 10).getTime(),
  new Date(2017, 9, 11).getTime(),
  new Date(2017, 9, 11).getTime(),
  new Date(2017, 9, 12).getTime(),
  new Date(2017, 9, 15).getTime(),
  new Date(2017, 9, 18).getTime(),
  new Date(2017, 9, 19).getTime(),
  new Date(2017, 9, 19).getTime(),
  new Date(2017, 9, 24).getTime(),
  new Date(2017, 9, 24).getTime(),
  new Date(2017, 9, 25).getTime(),
  new Date(2017, 9, 26).getTime()
];

window.onload = function() {
  var appElement = document.querySelector('[ng-app=csfair]');
  var $scope = angular.element(appElement).scope();
  $scope.$apply(function() {
    $scope.showEvent = [];
    for (var i = 0; i < eventDates.length; i++) {
     $scope.showEvent.push(d < eventDates[i]);
     console.log($scope.showEvent[i]);
    }
  });
}
