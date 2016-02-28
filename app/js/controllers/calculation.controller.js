(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'ComparisonService', 'ResultsService', 'StorageService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, ComparisonService, ResultsService, StorageService, ValidationService) {
        const cacheKey = 'CalculationController.model';

        let model = {
            balance: null,
            comparisons: [],
            monthlyPayment: null
        };

        angular.extend($scope, {
            actions: {
                addComparison: ComparisonService.add,
                addMortgage: ComparisonService.addMortgage,
                deleteComparison: ComparisonService.remove,
                onSubmitted: onSubmitted
            },
            model: model,
            results: ResultsService.results,
            showError: ValidationService.showError
        });

        loadModel();

        function loadModel() {
            angular.extend(model, StorageService.get(cacheKey));
            model.comparisons = ComparisonService.comparisons;
        }

        function onSubmitted(form) {
            saveModel();
            if (!form.$valid) {
                return;
            }
            ResultsService.update(model);
        }

        function saveModel() {
            ComparisonService.save();

            return StorageService.set(cacheKey, {
                balance: model.balance,
                monthlyPayment: model.monthlyPayment
            });
        }
    }
})();