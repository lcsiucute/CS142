'use strict';

// cs142App.controller('UserPhotosController', ['$scope', '$routeParams',
//   function ($scope, $routeParams) {
//     /*
//      * Since the route is specified as '/photos/:userId' in $routeProvider config the
//      * $routeParams  should have the userId property set with the path from the URL.
//      */

//     var userId = $routeParams.userId;
//     console.log('UserPhoto of ', $routeParams.userId);

//     console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
//       window.cs142models.photoOfUserModel(userId));

//     $scope.getPhotos = function () {
//       return window.cs142models.photoOfUserModel(userId);
//     };

//     console.log('photos done');
//     console.log(document.location.pathname);

//   }
// ]);

// cs142App.controller('UserPhotosController', ['$scope', '$rootScope', '$routeParams',
//   function($scope, $rootScope, $routeParams) {
//     var userId = $routeParams.userId;
//     // get user name first
//     $rootScope.FetchModel('/user/' + userId, function(data) {
//       $scope.$apply(function() {
//         $scope.userName = data.first_name + ' ' + data.last_name;
//         // set displayed content
//         $rootScope.contentDisplayed = 'Photos of ' + $scope.userName;
//       });
//     });
//     // then get all photos
//     $rootScope.FetchModel('/photosOfUser/' + userId, function(data) {
//       $scope.$apply(function() {
//         $scope.getPhotos = function() {
//           return data;
//         };
//       });
//     });
//   }
// ]);


cs142App.controller('UserPhotosController', ['$scope', '$rootScope', '$routeParams', '$resource',
  function($scope, $rootScope, $routeParams, $resource) {


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

  }
]);