'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$rootScope', '$resource',
    // function ($scope, $rootScope) {
    function ($scope, $rootScope, $resource) {
        $scope.main = {};
        $scope.main.title = 'Users';

        // $scope.getSchema = function($scope, $resource) {
        //     var schemaInfo = $resource('/test/info');
        //     var info = schemaInfo.get({}, function() {
        //         $scope.versionNumber = info.__v;
        //         $scope.versionInfo = 'Version ' + $scope.versionNumber;
        //     });
        // };

        // $scope.getSchema();

        // // this is function definition
        // $rootScope.FetchModel = function(url, doneCallback) {
        //     var httpRequest = new XMLHttpRequest();
        //     httpRequest.onreadystatechange = function() {
        //         if (httpRequest.readyState === 4) {
        //             if (httpRequest.status === 200) {
        //                 // data comes from parsing the http response
        //                 var data = JSON.parse(httpRequest.responseText);
        //                 if (doneCallback) {
        //                     // processing the response
        //                     doneCallback(data);
        //                 }
        //             }
        //         }
        //     };
        //     httpRequest.open('GET', url);
        //     httpRequest.send();
        // };

        // // this is function call
        // $rootScope.FetchModel('/test/info', function(data){
        //     // do something with your data
        //     $scope.$apply(function() {
        //         $scope.versionNumber = data.__v;
        //         $scope.versionInfo = 'Version ' + $scope.versionNumber;
        //     });
        // });


    }]);