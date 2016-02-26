(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    class Statement {
        constructor(balance) {
            this.balance = balance;
            this.periods = [];
            this.totalSpend = 0;
        }

        addPeriod(period) {
            period.finishingBalance = this.balance;
            this.periods.push(period);
        }

        first() {
            if (this.periods.length === 0) {
                return null;
            }

            return this.periods[0];
        }

        startingBalance() {
            if (!this.first) {
                return 0;
            }
            return this.first.startingBalance;
        }
    }
})();