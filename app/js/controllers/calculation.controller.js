(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage', 'CalculationService', 'StorageService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage, CalculationService, StorageService) {

        angular.extend($scope, {
            actions: {
                addComparison: addComparison,
                addMortgage: addMortgage,
                calculate: calculate
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

            $scope.data.statements = [];

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let months = CalculationService.getStatement(balance, comparison, duration, monthlyPayment);
                $scope.data.statements.push(months);
            }

            saveModel();
        }

        function getDefaultModel() {
            return {
                balance: null,
                comparisons: [],
                duration: null,
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
            comparison.submitCount = 0;
        }

        function saveModel() {
            StorageService.set('model', $scope.model);
        }
    }
})();