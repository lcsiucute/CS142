'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$rootScope', '$routeParams', '$resource', '$location',
  function($scope, $rootScope, $routeParams, $resource, $location) {


    var userId = $routeParams.userId;
    // get user name first
    $scope.getName = function(x) {
        var res = $resource('/user/:id');
        res.get({'id' : x}).$promise.then(function(response) {
            $scope.userName = response.first_name + ' ' + response.last_name;
            $rootScope.contentDisplayed = 'Photos of ' + $scope.userName;
        });
    };

    $scope.getPhotos = function(x) {
        var res = $resource('/photosOfUser/:id');
        res.query({'id' : x}).$promise.then(function(response) {
           $scope.userPhotos = response; 
        });
    };

    $scope.getName(userId);
    $scope.getPhotos(userId);

    $scope.addComment = function () {
            var resource = $resource('/commentsOfPhoto/' + $scope.photo._id);
            resource.save({
                comment: $scope.com
            }, function () {
                console.log("remember to support refresh");
            }, function (err) {
                    if (err.data === "Empty Comments") {
                        document.getElementById("cid").style.background = "#ff5f5f";
                        document.getElementById("Error").innerHTML = "Empty comment is not allowed";
                    }
            });
    };
  }
]);