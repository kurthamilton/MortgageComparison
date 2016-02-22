(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage', 'CalculationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage, CalculationService) {
        $scope.model = {
            balance: null,
            comparisons: [],
            duration: null,
            monthlyPayment: null
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
            let balance = $scope.model.balance;
            let duration = $scope.model.duration;
            let monthlyPayment = $scope.model.monthlyPayment;

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let months = CalculationService.getStatement(balance, comparison, duration, monthlyPayment);
                comparison.statement = months;
            }
        }

        function prepareComparison(comparison) {
            comparison.newMortgage = new Mortgage();
            comparison.submitCount = 0;
        }
    }
})();