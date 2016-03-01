(function() {
    'use strict';

    ResultsService.$inject = ['CalculationService', 'ChartData'];
    angular.module('app').service('ResultsService', ResultsService);

    function ResultsService(CalculationService, ChartData) {
        let results = {
            chartData: null,
            statements: []
        };

        angular.extend(this, {
            results: results,
            update: update
        });

        function buildChartData() {
            let chartData = new ChartData();

            angular.forEach(results.statements, statement => {
                if (statement) {
                    let data = [];
                    angular.forEach(statement.periods, function(period, i) {
                        if (i > chartData.labels.length - 1) {
                            chartData.addLabel(i);
                        }
                        data.push(period.cumulativeSpend);
                    });

                    chartData.addDataset(statement.description, data);
                }
            });

            results.chartData = chartData;


            return;
            results.chartData = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
        }

        function calculate(model) {
            results.statements = model.mortgages.map(mortgage =>
                CalculationService.getYearlyPayments(mortgage, model.balance, model.payment)
            );
        }

        function update(model) {
            calculate(model);
            buildChartData();
        }
    }
})();