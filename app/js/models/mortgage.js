(function() {
    'use strict';
    
    angular.module('app').factory('Mortgage', () => Mortgage);

    class Mortgage {
        constructor(apr, fee, includeFee, term) {
            this.apr = apr;
            this.fee = fee;
            this.includeFee = includeFee;
            this.term = term;
        }
        
        valid() {
            return this.apr > 0 && this.term > 0;
        }
    };
})();