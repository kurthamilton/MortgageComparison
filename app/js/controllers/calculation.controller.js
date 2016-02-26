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
                showChart: showChart
            },
            data: {
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

        function showChart() {
            var ctx = document.getElementById("myChart").getContext("2d");

            var data = {
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

            var myLineChart = new Chart(ctx).Line(data, {
                bezierCurve: false
            });
        }
    }
})();