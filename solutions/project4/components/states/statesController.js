/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function ($scope) {

    // Replace this with the code for CS142 Project #4, Problem #2
    // console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    $scope.textInput = '';
    $scope.targetStates = function(str) {
        var states = window.cs142models.statesModel();
        var target_states = [];
        // console.log('target_states start', target_states);
        for (var i = 0; i < states.length; i++) {
            if (states[i].includes(str)) {
                target_states.push(states[i]);
            }
        }
        // console.log('target_states end', target_states);
        if(target_states.length === 0) {
            console.log('target_states empty');
            return ['No such country!'];
        }
        return target_states;
    };
}]);
