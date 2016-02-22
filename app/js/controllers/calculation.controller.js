(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage', 'CalculationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage, CalculationService) {
        $scope.model = {
            balance: 0,
            comparisons: [],
            comparisonStatements: {}
        };

        $scope.actions = {
            addComparison: addComparison,
            addMortgage: addMortgage,
            calculate: calculate
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

        function calculate() {
            // todo: move into service
            $scope.model.comparisonStatements = {};

            let balance = $scope.model.balance;
            let duration = 50;
            let monthlyPayment = 500;

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let months = CalculationService.calculateComparison(balance, comparison, duration, monthlyPayment);
                $scope.model.comparisonStatements[i] = months;
            }
        }

        function prepareComparison(comparison) {
            comparison.newMortgage = new Mortgage();
            comparison.submitCount = 0;
        }
    }
})();