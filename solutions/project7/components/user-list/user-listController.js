'use strict';

cs142App.controller('UserListController', ['$scope', '$resource', '$rootScope',
    function ($scope, $resource, $rootScope) {
        $scope.main.title = 'Users';
        $scope.getUsers = function() {
            var res = $resource('/user/list');
            $scope.allUsers = res.query({});
        };
        // call the function
        $scope.getUsers();
        $rootScope.contentDisplayed = 'List of Users';
    }
]);

