(function() {
    'use strict';

    ResultsService.$inject = ['CalculationService'];
    angular.module('app').service('ResultsService', ResultsService);

    function ResultsService(CalculationService) {
        let results = {
            chart: {},
            statements: []
        };

        angular.extend(this, {
            results: results,
            update: update
        });

        function update(options) {
            calculate(options);
            updateChartData();
        }

        function calculate(options) {
            results.statements = [];

            angular.forEach(options.comparisons, function(comparison) {
                let statement = CalculationService.getYearlyPayments(comparison, options.balance, options.monthlyPayment);
                results.statements.push(statement);
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