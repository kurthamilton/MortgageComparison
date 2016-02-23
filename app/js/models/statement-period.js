(function() {
    'use strict';

    angular.module('app').factory('StatementPeriod', () => StatementPeriod);

    class StatementPeriod {
        constructor(startingBalance) {
            this.cumulativeSpend = 0;
            this.finishingBalance = startingBalance;
            this.startingBalance = startingBalance;
            this.spend = 0;
        }
    }
})();