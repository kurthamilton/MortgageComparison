(function() {
    'use strict';

    ComparisonService.$inject = ['Mortgage', 'StorageService'];
    angular.module('app').service('ComparisonService', ComparisonService);

    function ComparisonService(Mortgage, StorageService) {
        const cacheKey = 'ComparisonService.model';

        let model = {
            balance: null,
            mortgages: [],
            newMortgage: new Mortgage(),
            payment: null
        }

        angular.extend(this, {
           model: model,
           add: add,
           remove: remove,
           save: save
        });

        load();

        function add() {
            if (!model.newMortgage.valid()) {
                return false;
            }
            model.mortgages.push(model.newMortgage);
            model.newMortgage = new Mortgage();
        }

        function load() {
            let saved = StorageService.get(cacheKey);
            if (!saved) {
                return;
            }

            angular.extend(model, {
                balance: saved.balance,
                mortgages: saved.mortgages.map(m => new Mortgage(m)),
                payment: saved.payment
            });
        }

        function remove(index) {
            if (index >= 0 && index < model.mortgages.length) {
                model.mortgages.splice(index, 1);
            }
        }

        function save() {
            return StorageService.set(cacheKey, model);
        }
    }
})();