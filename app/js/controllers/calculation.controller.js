(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage', 'CalculationService', 'StorageService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage, CalculationService, StorageService) {

        angular.extend($scope, {
            actions: {
                addComparison: addComparison,
                addMortgage: addMortgage,
                calculate: calculate,
                deleteComparison: deleteComparison
            },
            data: {
                statements: []
            },
            model: loadModel()
        });

        init();

        function addComparison() {
            let comparison = new Comparison();
            prepareComparison(comparison);
            $scope.model.comparisons.push(comparison);
        }

        function addMortgage(comparison) {
            if (!comparison.newMortgage.valid()) {
                return false;
            }
            comparison.mortgages.push(comparison.newMortgage);
            prepareComparison(comparison);
        }

        function calculate() {
            let balance = $scope.model.balance;
            let monthlyPayment = $scope.model.monthlyPayment;

            $scope.data.statements = [];

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let months = CalculationService.getMonthlyPayments(balance, comparison, monthlyPayment);
                $scope.data.statements.push(months);
            }

            saveModel();
        }

        function deleteComparison(index) {
            if (index >= 0 && index < $scope.model.comparisons.length) {
                $scope.model.comparisons.splice(index, 1);
            }
        }

        function getDefaultModel() {
            return {
                balance: null,
                comparisons: [],
                monthlyPayment: null
            };
        }

        function init() {
            if ($scope.model.comparisons.length === 0) {
                addComparison();
            }
        }

        function loadModel() {
            let model = getDefaultModel();
            let savedModel = StorageService.get('model');
            if (savedModel !== null) {
                model = angular.extend(model, savedModel);

                // reload objects
                for (let i = 0; i < model.comparisons.length; i++) {
                    let comparison = model.comparisons[i];
                    for (let m = 0; m < comparison.mortgages.length; m++) {
                        comparison.mortgages[m] = new Mortgage(comparison.mortgages[m]);
                    }
                    prepareComparison(comparison);
                }
            }
            return model;
        }

        function prepareComparison(comparison) {
            comparison.newMortgage = new Mortgage();
        }

        function saveModel() {
            StorageService.set('model', $scope.model);
        }
    }
})();