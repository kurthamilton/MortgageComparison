(function() {
    'use strict';

    ResultsService.$inject = ['CalculationService'];
    angular.module('app').service('ResultsService', ResultsService);

    function ResultsService(CalculationService) {
        let results = {
            chart: {
                data: [],
                labels: [],
                series: []
            },
            statements: []
        };

        angular.extend(this, {
            results: results,
            update: update
        });

        function update(options) {
            calculate(options);
            buildChart();
        }

        function calculate(options) {
            results.statements = [];

            angular.forEach(options.mortgages, function(mortgage) {
                let statement = CalculationService.getYearlyPayments(mortgage, options.balance, options.monthlyPayment);
                results.statements.push(statement);
            });
        }

        function buildChart() {
            let data = [],
                labels = [],
                series = [];

            angular.forEach(results.statements, function(statement, serie) {
                if (statement) {
                    series.push(serie + 1);

                    let seriesData = [];
                    angular.forEach(statement.periods, function(period, i) {
                        if (i > labels.length - 1) {
                            labels.push(i);
                        }
                        seriesData.push(period.cumulativeSpend);
                    });
                    data.push(seriesData);
                }
            });

            results.chart.data = data;
            results.chart.labels = labels;
            results.chart.series = series;
        }
    }
})();