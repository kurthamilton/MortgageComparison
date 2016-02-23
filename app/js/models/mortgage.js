(function() {
    'use strict';

    angular.module('app').factory('Mortgage', () => Mortgage);

    class Mortgage {
        constructor(mortgage) {
            mortgage = mortgage || {
                apr: null,
                fee: null,
                includeFee: false,
                term: null
            };

            this.apr = mortgage.apr;
            this.fee = mortgage.fee;
            this.includeFee = mortgage.includeFee;
            this.term = mortgage.term;
        }

        valid() {
            return this.apr > 0;
        }
    };
})();