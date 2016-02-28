(function() {
    'use strict';

    ComparisonService.$inject = ['Comparison', 'Mortgage', 'StorageService'];
    angular.module('app').service('ComparisonService', ComparisonService);

    function ComparisonService(Comparison, Mortgage, StorageService) {
        const cacheKey = 'ComparisonService.comparisons';

        let comparisons = load() || [];

        angular.extend(this, {
           comparisons: comparisons,
           add: add,
           addMortgage: addMortgage,
           remove: remove,
           save: save
        });

        init();

        function add() {
            comparisons.push(create());
        }

        function addMortgage(comparison) {
            if (!comparison.newMortgage.valid() || !comparison.canAddMortgage()) {
                return false;
            }
            comparison.addMortgage(comparison.newMortgage);
            comparison.newMortgage = new Mortgage();
            return true;
        }

        function create() {
            let comparison = new Comparison();
            // todo: better way to do this? Either make part of model or store elsewhere
            comparison.newMortgage = new Mortgage();
            return comparison;
        }

        function init() {
            if (comparisons.length === 0) {
                add();
            }
        }

        function load() {
            let saved = StorageService.get(cacheKey);
            if (!angular.isArray(saved)) {
                return null;
            }

            return saved.map(object => parse(object));
        }

        function parse(object) {
            let comparison = create();
            comparison.monthlyOverpayment = object.monthlyOverpayment;
            comparison.mortgages = parseMortgages(object.mortgages);
            return comparison;
        }

        // todo: MortgageService
        function parseMortgages(objects) {
            let mortgages = [];
            if (!angular.isArray(objects)) {
                return mortgages;
            }

            angular.forEach(objects, function(value) {
                mortgages.push(new Mortgage(value))
            });

            return mortgages;
        }

        function remove(index) {
            if (index >= 0 && index < comparisons.length) {
                comparisons.splice(index, 1);
            }
        }

        function save() {
            return StorageService.set(cacheKey, comparisons);
        }
    }
})();