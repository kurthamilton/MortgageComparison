(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    function Statement(balance, description) {
        this.balance = balance;
        this.description = description;
        this.periods = [];
        this.startingBalance = balance;
        this.totalSpend = 0;
    }
    Statement.prototype.addPeriod = function(period) {
        period.balance = this.balance;
        this.periods.push(period);
    };
})();