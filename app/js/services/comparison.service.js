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
           maxApr: maxApr,
           remove: remove,
           save: save,
           validMortgages: validMortgages
        });

        load();
        ensureStarterMortgage();

        function add() {
            model.mortgages.push(new Mortgage());
            save();
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

        function maxApr() {
            if (model.balance > 0 && model.payment > 0) {
                return (model.payment / model.balance) * 12 * 100;
            }
            return 100;
        }

        function remove(index) {
            if (index >= 0 && index < model.mortgages.length) {
                model.mortgages.splice(index, 1);
                save();
                ensureStarterMortgage();
            }
        }

        function save() {
            return StorageService.set(cacheKey, {
                balance: model.balance,
                mortgages: validMortgages(),
                payment: model.payment
            });
        }

        function validMortgages() {
            return model.mortgages.filter(m => m.valid());
        }
    }
})();