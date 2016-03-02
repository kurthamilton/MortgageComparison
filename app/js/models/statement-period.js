(function() {
    'use strict';

    angular.module('app').factory('StatementPeriod', () => StatementPeriod);

    function StatementPeriod(statement) {
        this.cumulativeSpend = statement.totalSpend;
        this.balance = statement.balance;
        this.spend = 0;
        this.statement = statement;
    }

    StatementPeriod.prototype.addFee = function(fee, addToBalance) {
        if (!angular.isNumber(fee) || fee <= 0) {
            return;
        }

        if (addToBalance === true) {
            this.statement.balance += fee;
        } else {
            this.addSpend(fee);
        }
    };

    StatementPeriod.prototype.addInterest = function(monthlyRate) {
        if (!angular.isNumber(monthlyRate) || monthlyRate <= 0) {
            return;
        }
        this.statement.balance += (this.statement.balance * monthlyRate);
    };

    StatementPeriod.prototype.addSpend = function(spend) {
        if (!angular.isNumber(spend) || spend <= 0) {
            return;
        }
        this.spend += spend;
        this.cumulativeSpend += spend;
        this.statement.totalSpend += spend;
    };

    StatementPeriod.prototype.makePayment = function(payment) {
        if (!angular.isNumber(payment) || payment <= 0) {
            return;
        }

        if (payment > this.statement.balance) {
            payment = this.statement.balance;
        }
        this.statement.balance -= payment;
        this.addSpend(payment);
    };
})();