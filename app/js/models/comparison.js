(function() {
    'use strict';

    angular.module('app').factory('Comparison', () => Comparison);

    class Comparison {
        constructor() {
            this.mortgages = [];
        }

        addMortgage(mortgage) {
            this.mortgages.push(mortgage);
        }
    }
})();