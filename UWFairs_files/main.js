var csfair = angular.module('csfair',[]);

csfair.controller('mainControl', function($scope, $http) {
	$scope.showHidden = false;
	$scope.showEmail = false;
	$scope.showYes = false;


	$scope.savedEmail = "";
	$( document ).ready(function() {
		if (localStorage.getItem('Email') != null) {
			$scope.savedEmail = localStorage.getItem("Email");
			//document.getElementById("emailField").defaultValue = $scope.savedEmail;
		}
	});

	$http({method: 'GET', url: 'https://cors-anywhere.herokuapp.com/https://spreadsheets.google.com/feeds/list/1xorN2XIeV8HbKEhT86ONjRfakSbbVU8UvG5E9h-KS6g/od6/public/values?alt=json'}).
			    success(function(feed, status, headers, config) {
			      var results = feed.feed.entry;
			      $scope.events = [];
			      for (var i = 0; i < results.length; i++) {
			      	if (results[i].gsx$past && results[i].gsx$past.$t && results[i].gsx$past.$t === "yes") {
			      		continue;
			      	}
			      	var bullets = results[i].gsx$bullets.$t;
			      	if (bullets == '') {
			      		results[i].gsx$bullets = [];
			      	} else {
			      		results[i].gsx$bullets = bullets.split("#");
			      	}
			      	$scope.events.push(results[i]);
			      }
			    }).
			    error(function(data, status, headers, config) {
			      console.log(status);
	});

	$scope.submitEmail = function(index) {
		$('.sub'+index).prop('disabled', true);
		console.log(index);
		$(".submitted"+index).show();
		$scope.savedEmail = document.getElementById('emailField' + index).value;
		localStorage.setItem('Email', document.getElementById('emailField' + index).value);
		$('.sub'+index).prop('disabled', false);
	};
});