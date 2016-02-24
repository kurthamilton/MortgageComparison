(function() {
    'use strict';

    CalculationService.$inject = ['StatementPeriod'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(StatementPeriod) {
        this.getMonthlyPayments = function(balance, comparison, monthlyPayment) {
            let statement = [];
            let totalSpend = 0;

            if (comparison.mortgages.length == 0 || monthlyPayment <= 0) {
                return statement;
            }

            // todo - validate / handle silly values to prevent infinite loop
            while (balance > 0) {
                for (let i = 0; i < comparison.mortgages.length; i++) {
                    if (i === 0 && statement.length > 0) {
                        // repeat last mortgage until balance = 0
                        i = comparison.mortgages.length - 1;
                    }

                    let mortgage = comparison.mortgages[i];

                    if (i === comparison.mortgages.length - 1 && mortgage.monthlyRate > (monthlyPayment / balance)) {
                        console.log('infinite mortgage encountered');
                        return statement;
                    }

                    // repeat term-less mortgages until balance = 0
                    let term = mortgage.term > 0 ? mortgage.term : Infinity;
                    for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                        let period = new StatementPeriod(balance);

                        if (mortgageMonth === 0 && mortgage.fee > 0) {
                            // add fee to mortgage or spend at start of term
                            if (mortgage.includeFee === true) {
                                balance += mortgage.fee;
                            } else {
                                period.spend += mortgage.fee;
                            }
                        }

                        // add interest at start of month
                        balance += (balance * mortgage.monthlyRate);

                        let monthPayment = monthlyPayment <= balance ? monthlyPayment : balance;

                        balance -= monthPayment;
                        period.finishingBalance = balance;

                        period.spend += monthPayment;
                        period.cumulativeSpend = (totalSpend += period.spend);

                        statement.push(period);

                        if (balance === 0) {
                            return statement;
                        }
                    }
                }

                // get out to prevent infinite loop - this shouldn't be reachable with proper validation
                if (statement.length === 0 || statement.length > 10 && balance > statement[0].startingBalance) {
                    console.log('monthly payments cannot be calculated');
                    return statement;
                }
            }
        };
    }

})();