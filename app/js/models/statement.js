(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    class Statement {
        constructor(balance) {
            this.balance = balance;
            this.periods = [];
            this.startingBalance = balance;
            this.totalSpend = 0;
        }

        addPeriod(period) {
            period.balance = this.balance;
            this.periods.push(period);
        }

        first() {
            if (this.periods.length === 0) {
                return null;
            }

            return this.periods[0];
        }
    }
})();