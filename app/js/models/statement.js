(function() {
    'use strict';

    angular.module('app').factory('Statement', () => Statement);

    class Statement {
        constructor(balance) {
            this.balance = balance;
            this.periods = [];
            this.totalSpend = 0;
        }

        addInterest(monthlyRate) {
            this.balance += (this.balance * monthlyRate);
        }

        addPeriod(period) {
            period.cumulativeSpend = this.totalSpend;
            period.finishingBalance = this.balance;
            this.periods.push(period);
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

        makePayment(payment) {
            if (payment > this.balance) {
                payment = this.balance;
            }
            this.balance -= payment;
            this.totalSpend += payment;
            return payment;
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

        startMortgage(fee, addToBalance) {
            if (fee > 0) {
                if (addToBalance === true) {
                    this.balance += fee;
                } else {
                    this.totalSpend += fee;
                    return fee;
                }
            }
            return 0;
        }
    }
})();