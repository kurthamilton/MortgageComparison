(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'ComparisonService', 'ResultsService', 'StorageService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, ComparisonService, ResultsService, StorageService, ValidationService) {
        const cacheKey = 'CalculationController.model';

        let model = {
            balance: null,
            mortgages: [],
            monthlyPayment: null,
            newMortgage: null
        };

        angular.extend($scope, {
            actions: {
                add: ComparisonService.add,
                delete: ComparisonService.remove,
                onSubmitted: onSubmitted
            },
            model: model,
            results: ResultsService.results,
            showError: ValidationService.showError
        });

        loadModel();

        function loadModel() {
            angular.extend(model, StorageService.get(cacheKey));
            model.mortgages = ComparisonService.mortgages;
            model.newMortgage = ComparisonService.newMortgage;
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