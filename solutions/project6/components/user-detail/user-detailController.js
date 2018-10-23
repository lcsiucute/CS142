'use strict';

// cs142App.controller('UserDetailController', ['$scope', '$routeParams',
//   function ($scope, $routeParams) {
//     /*
//      * Since the route is specified as '/users/:userId' in $routeProvider config the
//      * $routeParams  should have the userId property set with the path from the URL.
//      */
//     console.log($scope);

//     var userId = $routeParams.userId;
//     console.log('UserDetail of ', userId);

//     console.log('window.cs142models.userModel($routeParams.userId)',
//       window.cs142models.userModel(userId));

//     $scope.user = window.cs142models.userModel(userId);

//   }
// ]);

// cs142App.controller('UserDetailController', ['$scope', '$rootScope', '$routeParams', 
//   function($scope, $rootScope, $routeParams) {
//     var userId = $routeParams.userId;
//     $rootScope.FetchModel('/user/' + userId, function(data) {
//       $scope.$apply(function() {
//         $scope.user = data;
//         $rootScope.contentDisplayed = data.first_name + ' ' + data.last_name;
//       });
//     }
//   );
// }]);

cs142App.controller('UserDetailController', ['$scope', '$rootScope', '$routeParams', '$resource', 
  function($scope, $rootScope, $routeParams, $resource) {
    var userId = $routeParams.userId;
    $scope.getUser = function(x) {
        var userInfo = $resource('/user/:id').get({'id' : x});
        userInfo.$promise.then(function(response) {
            // notice here: this function is an asynchronous callback function
            // the response is available when resource is fetched
            // hence, when the last line is reached, this function may be still waiting for resource
            // because rootScope.contentDisplayed depends on response
            // therefore it must be included in this callback function, not outside
            $scope.user = response;
            $rootScope.contentDisplayed = response.first_name + ' ' + response.last_name;
        }, function(error) {
            console.log();
        });
    };
    // call the function
    $scope.getUser(userId);
}]);