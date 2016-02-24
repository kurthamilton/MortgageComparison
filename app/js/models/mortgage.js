(function() {
    'use strict';

    angular.module('app').factory('Mortgage', () => Mortgage);

    class Mortgage {
        constructor(options) {
            options = options || {
                apr: null,
                fee: null,
                includeFee: false,
                term: null
            };

            this.apr = options.apr;
            this.fee = options.fee;
            this.includeFee = options.includeFee;
            this.term = options.term;
        }

        get monthlyRate() {
            return this.apr / 100 / 12;
        }

        valid() {
            return this.apr > 0;
        }
    };
})();