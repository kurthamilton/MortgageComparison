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
                save: saveModel
            },
            data: {
                statements: []
            },
            model: loadModel(),
            clean: function(form) {
                ValidationService.cleanElementState(form);
            },
            showError: function(element) {
                return ValidationService.showError(element);
            },
            validate: function(form) {
                return ValidationService.validate(form);
            }
        });

        init();

        function addComparison() {
            let comparison = new Comparison();
            prepareComparison(comparison);
            $scope.model.comparisons.push(comparison);
        }

        function addMortgage(comparison) {
            validateNewMortgage(comparison);
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
                let statement = CalculationService.getMonthlyPayments(balance, comparison, monthlyPayment);
                $scope.data.statements.push(statement);
            }
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
            comparison.newMortgage.touched = false;
        }

        function saveModel() {
            return StorageService.set('model', $scope.model);
        }

        function validateNewMortgage(comparison) {
            comparison.newMortgage.touched = true;
        }
    }
})();