(function() {
    'use strict';

    CalculationService.$inject = ['Statement', 'StatementPeriod'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Statement, StatementPeriod) {
        this.getMonthlyPayments = function(balance, comparison, monthlyPayment) {
            if (comparison.mortgages.length == 0 || monthlyPayment <= 0) {
                return null;
            }

            let statement = new Statement(balance);

            // todo - validate / handle silly values to prevent infinite loop
            while (statement.balance > 0) {
                for (let i = 0; i < comparison.mortgages.length; i++) {
                    if (i === 0 && statement.length > 0) {
                        // repeat last mortgage until balance = 0
                        i = comparison.mortgages.length - 1;
                    }

                    let mortgage = comparison.mortgages[i];

                    if ((i === comparison.mortgages.length - 1 || (mortgage.term || 0) === 0) && mortgage.monthlyRate > (monthlyPayment / statement.balance)) {
                        console.log('infinite mortgage encountered');
                        return statement;
                    }

                    // repeat term-less mortgages until balance = 0
                    let term = mortgage.term > 0 ? mortgage.term : Infinity;
                    for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                        let period = new StatementPeriod(statement.balance);

                        if (mortgageMonth === 0 && mortgage.fee > 0) {
                            // add fee to mortgage or spend at start of term
                            if (mortgage.includeFee === true) {
                                statement.balance += mortgage.fee;
                            } else {
                                period.spend += mortgage.fee;
                            }
                        }

                        // add interest at start of month
                        statement.balance += (statement.balance * mortgage.monthlyRate);

                        let monthPayment = monthlyPayment <= statement.balance ? monthlyPayment : statement.balance;

                        statement.balance -= monthPayment;
                        period.finishingBalance = statement.balance;

                        period.spend += monthPayment;
                        period.cumulativeSpend = (statement.totalSpend += period.spend);

                        statement.periods.push(period);

                        if (statement.balance === 0) {
                            return statement;
                        }
                    }
                }

                // get out to prevent infinite loop - this shouldn't be reachable with proper validation
                if (statement.periodCount === 0 || statement.periodCount > 10 && statement.balance > statement.startingBalance) {
                    console.log('monthly payments cannot be calculated');
                    return statement;
                }
            }
        };
    }

})();