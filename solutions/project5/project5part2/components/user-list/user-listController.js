'use strict';

// cs142App.controller('UserListController', ['$scope',
//     function ($scope) {
//         $scope.main.title = 'Users';

//         console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
//         $scope.getUsers = function() {
//             var users = window.cs142models.userListModel();
//             return users;
//         };
//         console.log('user list done');
//     }]);

cs142App.controller('UserListController', ['$scope', '$rootScope', 
    function($scope, $rootScope) {
        $scope.main.title = 'Users';
        $rootScope.FetchModel('/user/list', function(data){
            $scope.$apply(function() {
                $scope.getUsers = function () {
                    return data;
                };

                // display on the right
                $rootScope.contentDisplayed = 'List of Users';

                });
        });

}]);

