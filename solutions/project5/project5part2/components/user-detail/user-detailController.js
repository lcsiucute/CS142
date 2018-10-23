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

cs142App.controller('UserDetailController', ['$scope', '$rootScope', '$routeParams', 
  function($scope, $rootScope, $routeParams) {
    var userId = $routeParams.userId;
    $rootScope.FetchModel('/user/' + userId, function(data) {
      $scope.$apply(function() {
        $scope.user = data;
        $rootScope.contentDisplayed = data.first_name + ' ' + data.last_name;
      });
    }
  );
}]);