(function(){
	var app = angular.module("rtHome");
	
	app.controller("rtHome.MainController",["$scope","rtRestaurant.Model",function($scope,Restaurant){
    
    function defineScope(){
      $scope.find = find;	
    };
    function find(){
      Restaurant.textQuery({query:$scope.query})
    }
    defineScope();    
	}]);

}());