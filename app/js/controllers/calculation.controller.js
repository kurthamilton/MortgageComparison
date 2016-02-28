(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'CalculationService', 'ComparisonService', 'StorageService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, CalculationService, ComparisonService, StorageService, ValidationService) {
        const cacheKey = 'CalculationController.model';

        let model = {
            balance: null,
            comparisons: [],
            monthlyPayment: null
        };

        let results = {
            chart: {},
            statements: []
        };

        angular.extend($scope, {
            actions: {
                addComparison: ComparisonService.add,
                addMortgage: ComparisonService.addMortgage,
                deleteComparison: ComparisonService.remove,
                onSubmitted: onSubmitted
            },
            model: model,
            results: results,
            showError: ValidationService.showError
        });

        loadModel();

        function calculate() {
            results.statements = [];

            angular.forEach(model.comparisons, function(comparison) {
                let statement = CalculationService.getYearlyPayments(comparison, model.balance, model.monthlyPayment);
                results.statements.push(statement);
            });
        }

        function loadModel() {
            angular.extend(model, StorageService.get(cacheKey));
            model.comparisons = ComparisonService.comparisons;
        }

        function onSubmitted(form) {
            saveModel();
            if (!form.$valid) {
                return;
            }
            calculate();
            updateChartData();
        }

        function saveModel() {
            ComparisonService.save();

            return StorageService.set(cacheKey, {
                balance: model.balance,
                monthlyPayment: model.monthlyPayment
            });
        }

        function updateChartData() {
            results.chart = {
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