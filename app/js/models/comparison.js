(function() {
    'use strict';

    angular.module('app').factory('Comparison', () => Comparison);

    class Comparison {
        constructor() {
            this.mortgages = [];
        }

        addMortgage(mortgage) {
            if (this.canAddMortgage()) {
                this.mortgages.push(mortgage);
            }
        }

        canAddMortgage(comparison) {
            for (let i = this.mortgages.length - 1; i >= 0; i--) {
                let mortgage = this.mortgages[i];
                if (mortgage.isIndefinite) {
                    return false;
                }
            }

            return true;
        }
    }
})();