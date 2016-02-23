(function() {
    'use strict';

    angular.module('app').factory('StatementPeriod', () => StatementPeriod);

    class StatementPeriod {
        constructor(index, startingBalance) {
            this.cumulativeSpend = 0;
            this.finishingBalance = startingBalance;
            this.index = index;
            this.startingBalance = startingBalance;
            this.spend = 0;
        }
    }
})();