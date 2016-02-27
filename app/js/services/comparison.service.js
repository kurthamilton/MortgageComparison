(function() {
    'use strict';

    ComparisonService.$inject = ['Comparison', 'Mortgage', 'StorageService'];
    angular.module('app').service('ComparisonService', ComparisonService);

    function ComparisonService(Comparison, Mortgage, StorageService) {
        let service = this;

        const cacheKey = 'ComparisonService.comparisons';

        this.comparisons = load() || [];

        this.add = add;
        this.addMortgage = addMortgage;
        this.remove = remove;
        this.save = save;

        init();

        function add() {
            service.comparisons.push(create());
        }

        function addMortgage(comparison) {
            if (!comparison.newMortgage.valid()) {
                return false;
            }
            comparison.mortgages.push(comparison.newMortgage);
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
            if (service.comparisons.length === 0) {
                add();
            }
        }

        function load() {
            let saved = StorageService.get(cacheKey);
            if (!angular.isArray(saved)) {
                return null;
            }

            let comparisons = [];
            angular.forEach(saved, function(value) {
                let comparison = create();
                comparison.mortgages = parseMortgages(value.mortgages);
                comparisons.push(comparison);
            });

            return comparisons;
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
            if (index >= 0 && index < service.comparisons.length) {
                service.comparisons.splice(index, 1);
            }
        }

        function save() {
            return StorageService.set(cacheKey, service.comparisons);
        }
    }
})();