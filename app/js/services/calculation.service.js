(function() {
    'use strict';

    CalculationService.$inject = ['Statement', 'StatementPeriod'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Statement, StatementPeriod) {
        this.getMonthlyPayments = getMonthlyPayments;
        this.getYearlyPayments = getYearlyPayments;

        function getMonthlyPayments(balance, comparison, monthlyPayment) {
            // todo - validate / handle silly values to prevent infinite loop
            if (comparison.mortgages.length == 0 || balance <= 0 || monthlyPayment <= 0) {
                return null;
            }

            let statement = new Statement(balance);

            while (statement.balance > 0) {
                for (let i = 0; i < comparison.mortgages.length; i++) {
                    if (i === 0 && statement.periods.length > 0) {
                        // repeat last mortgage until balance = 0
                        i = comparison.mortgages.length - 1;
                    }

                    let mortgage = comparison.mortgages[i];

                    if (!mortgage.term && mortgage.monthlyRate > (monthlyPayment / statement.balance)) {
                        console.log('infinite mortgage encountered');
                        return null;
                    }

                    // repeat term-less mortgages until balance = 0
                    let term = mortgage.term > 0 ? mortgage.term : Infinity;
                    for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                        let period = new StatementPeriod(statement.balance);
                        if (mortgageMonth === 0) {
                            period.spend += statement.startMortgage(mortgage.fee, mortgage.includeFee);
                        }

                        statement.addInterest(mortgage.monthlyRate);
                        period.spend += statement.makePayment(monthlyPayment);
                        statement.addPeriod(period);

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

        function getYearlyPayments(balance, comparison, monthlyPayment) {
            let monthlyStatement = getMonthlyPayments(balance, comparison, monthlyPayment);
            if (!monthlyStatement) {
                return null;
            }

            let statement = new Statement(balance);
            let i = 0;
            while (i < monthlyStatement.periods.length) {
                let month = monthlyStatement.periods[i];

                if (i % 12 === 0) {
                    var period = new StatementPeriod(statement.balance);
                }
                period.spend += month.spend;
                statement.totalSpend += month.spend;
                statement.balance = month.finishingBalance;
                if (i % 12 === 11 || i === monthlyStatement.periods.length - 1) {
                    statement.addPeriod(period);
                    if (i === monthlyStatement.periods.length - 1) {
                        return statement;
                    }
                }

                i++;
            }
        };
    }

})();