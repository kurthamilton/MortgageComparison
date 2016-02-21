'use strict';

var app = window.app || {};

(function() {
    angular.module('app').factory('Mortgage', Mortgage);

    class Mortgage {
        constructor(apr, fee, includeFee, term) {
            this.apr = apr;
            this.fee = fee;
            this.includeFee = includeFee;
            this.term = term;
        }
    };
})();