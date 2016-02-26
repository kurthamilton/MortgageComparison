(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'Comparison', 'Mortgage', 'CalculationService', 'StorageService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, Comparison, Mortgage, CalculationService, StorageService, ValidationService) {
        angular.extend($scope, {
            actions: {
                addComparison: addComparison,
                addMortgage: addMortgage,
                calculate: calculate,
                deleteComparison: deleteComparison,
                save: saveModel,
                updateChartData: updateChartData
            },
            data: {
                chart: {},
                statements: []
            },
            model: loadModel(),
            showError: function(element) {
                return ValidationService.showError(element);
            },
            validation: {
                canAddMortgage: canAddMortgage
            }
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
            return true;
        }

        function calculate() {
            let balance = $scope.model.balance;
            let monthlyPayment = $scope.model.monthlyPayment;

            $scope.data.statements = [];

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let statement = CalculationService.getYearlyPayments(balance, comparison, monthlyPayment);
                $scope.data.statements.push(statement);
            }
            return true;
        }

        function canAddMortgage(comparison) {
            return comparison.hasIndefiniteMortgage() === false;
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
                angular.extend(model, savedModel);
                // reload objects
                model.comparisons = [];
                for (let i = 0; i < savedModel.comparisons.length; i++) {
                    let savedComparison = savedModel.comparisons[i];
                    let comparison = new Comparison();
                    for (let m = 0; m < savedComparison.mortgages.length; m++) {
                        comparison.mortgages.push(new Mortgage(savedComparison.mortgages[m]));
                    }
                    prepareComparison(comparison);
                    model.comparisons.push(comparison);
                }
            }
            return model;
        }

        function prepareComparison(comparison) {
            comparison.newMortgage = new Mortgage();
        }

        function saveModel() {
            return StorageService.set('model', $scope.model);
        }

        function updateChartData() {
            $scope.data.chart = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                series: ['Series A', 'Series B'],
                data: [
                    [65, 59, 80, 81, 56, 55, 40],
                    [28, 48, 40, 19, 86, 27, 90]
                ]
            };
        }
    }
})();