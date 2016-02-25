(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    class Statement {
        constructor(balance) {
            this.balance = balance;
            this.periods = [];
            this.totalSpend = 0;
        }

        first() {
            if (this.periods.length === 0) {
                return null;
            }

            return this.periods[0];
        }

        last() {
            if (this.periods.length === 0) {
                return null;
            }

            return this.periods[this.periods.length - 1];
        }

        periodCount() {
            return this.periods.length;
        }

        startingBalance() {
            if (!this.first) {
                return 0;
            }
            return this.first.startingBalance;
        }
    }
})();