(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'ComparisonService', 'ResultsService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, ComparisonService, ResultsService, ValidationService) {
        angular.extend($scope, {
            actions: {
                add: ComparisonService.add,
                delete: ComparisonService.remove,
                onSubmitted: onSubmitted
            },
            model: ComparisonService.model,
            results: ResultsService.results,
            showError: ValidationService.showError
        });

        function onSubmitted(form) {
            saveModel();
            if (!form.$valid) {
                return;
            }
            ResultsService.update(ComparisonService.model);
        }

        function saveModel() {
            ComparisonService.save();
        }
    }
})();