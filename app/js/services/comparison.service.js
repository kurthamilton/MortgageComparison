(function() {
    'use strict';

    ComparisonService.$inject = ['Mortgage', 'StorageService'];
    angular.module('app').service('ComparisonService', ComparisonService);

    function ComparisonService(Mortgage, StorageService) {
        let service = this;

        const cacheKey = 'ComparisonService.mortgages';
        
        let mortgages = load() || [];

        angular.extend(service, {
           mortgages: mortgages,
           newMortgage: new Mortgage(),
           add: add,
           remove: remove,
           save: save
        });

        function add() {
            let mortgage = service.newMortgage;
            if (!mortgage.valid()) {
                return false;
            }
            mortgages.push(new Mortgage(service.newMortgage));
            service.newMortgage.apr = null;
        }

        function load() {
            let saved = StorageService.get(cacheKey);
            if (!angular.isArray(saved)) {
                return null;
            }

            return saved.map(object => new Mortgage(object));
        }

        function remove(index) {
            if (index >= 0 && index < mortgages.length) {
                mortgages.splice(index, 1);
            }
        }

        function save() {
            return StorageService.set(cacheKey, mortgages);
        }
    }
})();