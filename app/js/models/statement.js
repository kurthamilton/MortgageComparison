(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    class Statement {
        constructor(balance, description) {
            this.balance = balance;
            this.description = description;
            this.periods = [];
            this.startingBalance = balance;
            this.totalSpend = 0;
        }

        addPeriod(period) {
            period.balance = this.balance;
            this.periods.push(period);
        }
    }
})();