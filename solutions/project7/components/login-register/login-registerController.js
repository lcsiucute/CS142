'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$rootScope', '$location', '$resource',
            function ($scope, $rootScope, $location, $resource) {
                $scope.submit = function () {
                    var resource = $resource('/admin/login');
                    resource.save({
                        login_name: $scope.ln,
                        password: $scope.pwd
                    }, function (userInfo) {
                        if (userInfo._id === undefined) {
                            document.getElementById("Error").innerHTML = "Invalid User ID";
                        } else {
                            $rootScope.user = userInfo;
                            $rootScope.loggedIn = true;
                            $location.path('/users/' + userInfo._id);
                        }
                    }, function (err) {
                        if (err.data === "Invalid User ID") {
                            document.getElementById("ln").style.background = "#ff5f5f";
                            document.getElementById("Error").innerHTML = "Invalid User ID";
                        } else if (err.data === "Incorrect Password") {
                            document.getElementById("pwd").style.background = "#ff5f5f";
                            document.getElementById("Error").innerHTML = "Incorrect Password";
                        } else if (err.data === "An Error Occurred") {
                            document.getElementById("Error").innerHTML = "An Error Occurred";
                        } else {
                            document.getElementById("Error").innerHTML = "Unknown Error";
                        }
                    });
                };

                $scope.register = function () {
                    if ($scope.password !== $scope.repassword) {
                        console.log("password does not match");
                        document.getElementById("RegError").innerHTML = "Password does not match";
                        document.getElementById("pass").style.background = "#ff5f5f";
                        document.getElementById("repass").style.background = "#ff5f5f";
                        document.getElementById("username").style.background = "white";
                        document.getElementById("first").style.background = "white";
                        document.getElementById("last").style.background = "white";
                        return;
                    }
                    var resource = $resource('/user');
                    resource.save({
                        login_name: $scope.login_name,
                        password: $scope.password,
                        first_name: $scope.first_name,
                        last_name: $scope.last_name,
                        location: $scope.loc,
                        description: $scope.desc,
                        occupation: $scope.occupation
                    }, function (user) {
                        console.log("register succeed");
                        $rootScope.user = user;
                        $rootScope.loggedIn = true;
                        $location.path('/users/' + user._id);
                    }, function (err) {
                        console.log("register error");
                        if (err.data === "login_name undefined") {
                            console.log("login_name undefined");
                            document.getElementById("RegError").innerHTML = "Username Required";
                            document.getElementById("username").style.background = "#ff5f5f";
                            document.getElementById("pass").style.background = "white";
                            document.getElementById("first").style.background = "white";
                            document.getElementById("last").style.background = "white";
                        } else if (err.data === "password undefined") {
                            console.log("password undefined");
                            document.getElementById("RegError").innerHTML = "Password Required";
                            document.getElementById("pass").style.background = "#ff5f5f";
                            document.getElementById("username").style.background = "white";
                            document.getElementById("first").style.background = "white";
                            document.getElementById("last").style.background = "white";
                        } else if (err.data === "first_name undefined") {
                            console.log("first_name undefined");
                            document.getElementById("RegError").innerHTML = "First Name Required";
                            document.getElementById("first").style.background = "#ff5f5f";
                            document.getElementById("pass").style.background = "white";
                            document.getElementById("username").style.background = "white";
                            document.getElementById("last").style.background = "white";
                        } else if (err.data === "last_name undefined") {
                            console.log("last_name undefined");
                            document.getElementById("RegError").innerHTML = "Last Name Required";
                            document.getElementById("last").style.background = "#ff5f5f";
                            document.getElementById("pass").style.background = "white";
                            document.getElementById("first").style.background = "white";
                            document.getElementById("username").style.background = "white";
                        } else if (err.data === "Create Error" || err.data === "Database Error") {
                            console.log("Create Error");
                            document.getElementById("RegError").innerHTML = "An Error Occurred.";
                            document.getElementById("username").style.background = "white";
                            document.getElementById("pass").style.background = "white";
                            document.getElementById("first").style.background = "white";
                            document.getElementById("last").style.background = "white";
                        } else if (err.data === "login_name exists") {
                            console.log("login_name exists");
                            document.getElementById("RegError").innerHTML = "Username Taken";
                            document.getElementById("username").style.background = "#ff5f5f";
                            document.getElementById("pass").style.background = "white";
                            document.getElementById("first").style.background = "white";
                            document.getElementById("last").style.background = "white";
                        }
                    });
                };
            }
]);