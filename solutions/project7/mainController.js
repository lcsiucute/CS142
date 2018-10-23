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
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$rootScope', '$location', '$resource', '$http',
    function ($scope, $rootScope, $location, $resource, $http) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $rootScope.loggedIn = false;
        $rootScope.user = null;

        $scope.logout = function() {
            var resource = $resource('/admin/logout/');
            resource.get({}, function() {
                $rootScope.user = null;
                $rootScope.loggedIn = false;
                $rootScope.contentDisplayed = "";
                $location.path("/login-register");
            });
        };

        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if(!$rootScope.loggedIn) {
               // no logged user, redirect to /login-register unless already there
              if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                  $location.path("/login-register");
              }
            } else {
              // If user is logged in, do not let them redirect to login-page before logging out.
              if(next.templateUrl === "components/login-register/login-registerTemplate.html"){
                 $location.path("/users/"+$rootScope.user.id);
              }
            }
         });

         var selectedPhotoFile;
         $scope.inputFileNameChanged = function(element) {
             selectedPhotoFile = element.files[0];
         };

         // Has the user selected a file?
        $scope.inputFileNameSelected = function () {
            return !!selectedPhotoFile;
        };

        // Upload the photo file selected by the user using a post request to the URL /photos/new
        $scope.uploadPhoto = function () {
            if (!$scope.inputFileNameSelected()) {
                console.error("uploadPhoto called will no selected file");
                return;
            }
            console.log('fileSubmitted', selectedPhotoFile);

            // Create a DOM form and add the file to it under the name uploadedphoto
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);

            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function successCallback(response){
                // The photo was successfully uploaded. XXX - Do whatever you want on success.
            }, function errorCallback(response){
                // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                console.error('ERROR uploading photo', response);
            });

        };

    }]);