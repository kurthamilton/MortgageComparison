(function() {
    'use strict';

    angular.module('app').factory('Mortgage', () => Mortgage);

    class Mortgage {
        constructor(options) {
            options = options || {
                apr: null,
                fee: null,
                includeFee: false,
                overpayment: null,
                term: null
            };

            this.apr = options.apr;
            this.fee = options.fee;
            this.includeFee = options.includeFee;
            this.overpayment = options.overpayment;
            this.term = options.term;
        }

        get isIndefinite() {
            return !this.term;
        }

        get monthlyRate() {
            return this.apr / 100 / 12;
        }

        valid() {
            return this.apr > 0;
        }
    };
})();