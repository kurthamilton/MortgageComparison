(function() {
    'use strict';

    angular.module('app').factory('Calculator', () => Calculator);

    class Calculator {
        constructor(balance, comparisons) {
            this.monthlyPayments = [];
            this.comparisons = comparisons;
            this.startingBalance = balance > 0 ? -1 * balance : balance;
            this.finishingBalance = this.startingBalance;
        }

        calculate(months, monthlyPayment) {
            this.reset();

            // todo - compound interest formula?
            this.finishingBalance = this.startingBalance;

            let cumulativeMonths = 0;
            for (let i = 0; i < this.mortgages.length; i++) {
                let mortgage = this.mortgages[i];
                if (i === 0 && mortgage.includeFee) {
                    this.finishingBalance -= mortgage.fee;
                }

                let term = mortgage.term > 0 ? mortgage.term : months - cumulativeMonths;
                for (let month = 0; month < term; month++) {
                    let payment = { month: cumulativeMonths, amount: 0 };

                    if (month === 0 && mortgage.includeFee === false) {
                        payment.amount += mortgage.fee;
                    }

                    this.finishingBalance += (this.finishingBalance * mortgage.monthlyRate);
                    this.finishingBalance += monthlyPayment;

                    payment.amount += monthlyPayment;

                    this.monthlyPayments.push(payment);

                    if (cumulativeMonths++ === months) {
                        return;
                    }
                }
            }
        }
    }
})();