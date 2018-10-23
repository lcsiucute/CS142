cs142App.controller('HeaderController', ['$scope', function ($scope) {

    // console.log('window.cs142models.headerModel()', window.cs142models.headerModel());
    $scope.wantedHeader = function() {
        var obj = window.cs142models.headerModel();
        return obj[0];
    };
}]);
