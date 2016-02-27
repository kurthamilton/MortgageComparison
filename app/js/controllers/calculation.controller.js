(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'CalculationService', 'ComparisonService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, CalculationService, ComparisonService, ValidationService) {
        angular.extend($scope, {
            actions: {
                addComparison: ComparisonService.add,
                addMortgage: ComparisonService.addMortgage,
                calculate: calculate,
                deleteComparison: ComparisonService.remove,
                save: saveModel,
                updateChartData: updateChartData
            },
            data: {
                chart: {},
                statements: []
            },
            model: {
                // todo: auto bind to service without having to structure the $scope's model like this
                calculation: CalculationService.model,
                comparisons: ComparisonService.comparisons
            },
            showError: ValidationService.showError,
            validation: {
                canAddMortgage: canAddMortgage
            }
        });

        function calculate() {
            $scope.data.statements = [];

            for (let i = 0; i < $scope.model.comparisons.length; i++) {
                let comparison = $scope.model.comparisons[i];
                let statement = CalculationService.getYearlyPayments(comparison);
                $scope.data.statements.push(statement);
            }
            return true;
        }

        function canAddMortgage(comparison) {
            return comparison.hasIndefiniteMortgage() === false;
        }

        function saveModel() {
            CalculationService.save();
            ComparisonService.save();
            return true;
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