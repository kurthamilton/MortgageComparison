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

        $scope.sortOptions = {
            //restrict move across columns. move only within column.
            /*accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },*/
            itemMoved: function (event) {
                event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
            },
            orderChanged: function (event) {
            }
        };

        updateResults();

        function onSubmitted(form) {
            saveModel();
            if (!form.$valid) {
                return;
            }
            updateResults();
        }

        function saveModel() {
            ComparisonService.save();
        }

        function updateResults() {
            ResultsService.update(ComparisonService.model);
        }
    }
})();