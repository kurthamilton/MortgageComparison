(function() {
    'use strict';

    ComparisonService.$inject = ['Mortgage', 'StorageService'];
    angular.module('app').service('ComparisonService', ComparisonService);

    function ComparisonService(Mortgage, StorageService) {
        const cacheKey = 'ComparisonService.model';

        let model = {
            balance: null,
            mortgages: [],
            payment: null
        }

        angular.extend(this, {
           model: model,
           add: add,
           remove: remove,
           save: save
        });

        load();
        ensureStarterMortgage();

        function add() {
            model.mortgages.push(new Mortgage());
        }

        function ensureStarterMortgage() {
            if (model.mortgages.length === 0) {
                add();
            }
        }

        function load() {
            let saved = StorageService.get(cacheKey);
            if (!saved) {
                return;
            }

            angular.extend(model, {
                balance: saved.balance,
                mortgages: saved.mortgages
                                .map(m => new Mortgage(m))
                                .filter(m => m.valid()),
                payment: saved.payment
            });
        }

        function remove(index) {
            if (index >= 0 && index < model.mortgages.length) {
                model.mortgages.splice(index, 1);
                ensureStarterMortgage();
            }
        }

        function save() {
            return StorageService.set(cacheKey, {
                balance: model.balance,
                mortgages: model.mortgages.filter(m => m.valid()),
                payment: model.payment
            });
        }
    }
})();