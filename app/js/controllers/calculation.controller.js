(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage) {
        $scope.model = {
            balance: 0,
            comparisons: []
        };

        $scope.actions = {
            addComparison: addComparison,
            addMortgage: addMortgage
        };

        addComparison();

        function addComparison() {
            let comparison = new Comparison();
            prepareComparison(comparison);
            $scope.model.comparisons.push(comparison);
        }

        function addMortgage(comparison) {
            comparison.submitCount++;
            if (!comparison.newMortgage.valid()) {
                return false;
            }
            comparison.addMortgage(comparison.newMortgage);
            prepareComparison(comparison);
        }

        function prepareComparison(comparison) {
            comparison.newMortgage = new Mortgage();
            comparison.submitCount = 0;
        }
    }
})();