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

        function update(model) {
            calculate(model);
            buildChart();
        }

        function calculate(model) {
            results.statements = model.mortgages.map(mortgage =>
                CalculationService.getYearlyPayments(mortgage, model.balance, model.payment)
            );
        }

        function buildChart() {
            let data = [],
                labels = [],
                series = [];

            angular.forEach(results.statements, (statement, seriesIndex) => {
                if (statement) {
                    series.push(seriesIndex + 1);

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