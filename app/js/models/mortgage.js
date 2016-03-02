(function() {
    'use strict';

    angular.module('app').factory('Mortgage', () => Mortgage);

    function Mortgage(options) {
        options = options || {
            apr: null,
            fee: null,
            includeFee: false,
            lumpSumOverpayment: null,
            monthlyOverpayment: null,
            term: null
        };

        this.apr = options.apr;
        this.fee = options.fee;
        this.includeFee = options.includeFee;
        this.lumpSumOverpayment = options.lumpSumOverpayment;
        this.monthlyOverpayment = options.monthlyOverpayment;
        this.term = options.term;
    };

    Mortgage.prototype.monthlyRate = function() {
        return this.apr / 100 / 12;
    };

    Mortgage.prototype.toString = function() {
        let description = `${this.apr}%`;
        if (this.term > 0) {
            description += ` | ${this.term}y`
        }
        if (this.fee > 0) {
            description += ` | ${this.fee} fee`
            if (this.includeFee === true) {
                description += ' (bal)';
            }
        }
        if (this.lumpSumOverpayment > 0 || this.monthlyOverpayment > 0) {
            description += ` | +${this.lumpSumOverpayment || 0}+${this.monthlyOverpayment || 0}`
        }
        return description;
    };

    Mortgage.prototype.valid = function() {
        return this.apr > 0;
    };

})();