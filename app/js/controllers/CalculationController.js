'use strict';

var mortgageCalculator = angular.module('mortgageCalculator', []);

mortgageCalculator.controller('CalculationController', function ($scope) {
    $scope.model = {
        balance: 0,
        mortgages: [],
        newMortgage: {}
    };

    $scope.actions = {
        addMortgage: function() {
            $scope.model.mortgages.push($scope.model.newMortgage);
            $scope.model.newMortgage = {};
        }
    };
});