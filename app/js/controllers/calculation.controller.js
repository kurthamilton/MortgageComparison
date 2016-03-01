(function() {
    'use strict';

    CalculationController.$inject = ['$scope', 'ComparisonService', 'ResultsService', 'ValidationService'];
    angular.module('app').controller('CalculationController', CalculationController);

    function CalculationController($scope, ComparisonService, ResultsService, ValidationService) {
        angular.extend($scope, {
            actions: {
                add: ComparisonService.add,
                delete: ComparisonService.remove,
                save: saveModel,
                submit: submit
            },
            change: changeForm,
            maxApr: ComparisonService.maxApr,
            model: ComparisonService.model,
            results: ResultsService.results,
            showError: ValidationService.showError
        });

        // Run the results if the form is valid
        // Use form ready to wait for child forms to load before validating
        angular.element($scope.form).ready(function() {
            if (validate()) {
                updateResults();
                // the updated results aren't digested when called in the ready function.
                // Not sure this is the right way to do this.
                $scope.$digest();
            }
            cleanForm();
        });

        function changeForm() {
            submit();
        }

        function cleanForm() {
            ValidationService.resetForm($scope.form);
        }

        function saveModel() {
            ComparisonService.save();
        }

        function submit() {
            saveModel();
            if (!validate()) {
                return;
            }
            updateResults();
            cleanForm();
        }

        function updateResults() {
            ResultsService.update(ComparisonService.model);
            cleanForm();
        }

        function validate() {
            ValidationService.submitForm($scope.form);
            return $scope.form.$valid;
        }
    }
})();