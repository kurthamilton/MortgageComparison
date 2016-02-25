(function() {
    'use strict';

    angular.module('app').factory('Comparison', () => Comparison);

    class Comparison {
        constructor() {
            this.mortgages = [];
        }

        hasIndefiniteMortgage() {
            for (let i = this.mortgages.length - 1; i >= 0; i--) {
                let mortgage = this.mortgages[i];
                if (mortgage.isIndefinite) {
                    return true;
                }
            }

            return false;
        }
    }
})();