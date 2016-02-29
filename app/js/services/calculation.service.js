(function() {
    'use strict';

    CalculationService.$inject = ['Statement', 'StatementPeriod'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Statement, StatementPeriod) {

        angular.extend(this, {
            getMonthlyPayments: getMonthlyPayments,
            getYearlyPayments: getYearlyPayments
        });

        function getMonthlyPayments(mortgage, balance, monthlyPayment) {
            // todo - validate / handle silly values to prevent infinite loop
            if (balance <= 0 || monthlyPayment <= 0) {
                return null;
            }

            // todo - validate on creation
            if (!mortgage.term && mortgage.monthlyRate > (monthlyPayment / balance)) {
                console.log('infinite mortgage encountered');
                return null;
            }

            let statement = new Statement(balance, mortgage.toString());
            // add 0-th period
            statement.addPeriod(new StatementPeriod(statement));

            while (statement.balance > 0) {

                // repeat term-less mortgage until balance = 0
                let term = mortgage.term > 0 ? mortgage.term * 12 : Infinity;
                for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                    let period = new StatementPeriod(statement);
                    if (mortgageMonth === 0) {
                        period.addFee(mortgage.fee, mortgage.includeFee)
                        period.makePayment(mortgage.lumpSumOverpayment);
                    }
                    period.addInterest(mortgage.monthlyRate);
                    period.makePayment(monthlyPayment);
                    period.makePayment(mortgage.monthlyOverpayment);
                    statement.addPeriod(period);

                    if (statement.balance === 0) {
                        return statement;
                    }
                }
            }

            // get out to prevent infinite loop - this shouldn't be reachable with proper validation
            if (statement.periods.length === 0 || statement.periods.length > 10 && statement.balance > statement.startingBalance) {
                console.log('monthly payments cannot be calculated');
                return statement;
            }
        }

        function getYearlyPayments(mortgage, balance, monthlyPayment) {
            let statement = getMonthlyPayments(mortgage, balance, monthlyPayment);
            return getAggregatedStatement(statement, 12);
        }

        function getAggregatedStatement(source, numberOfMonths) {
            if (!source) {
                return null;
            }

            let periods = angular.copy(source.periods);
            let statement = new Statement(source.startingBalance, source.description);
            // add 0-th period
            addAggregatePeriod(statement, 1);
            while (periods.length > 0) {
                addAggregatePeriod(statement, periods.splice(0, numberOfMonths))
            }
            return statement;
        }

        function addAggregatePeriod(statement, periods) {
            if (!periods || periods.length === 0) {
                return null;
            }

            let period = new StatementPeriod(statement);
            for (let i = 0; i < periods.length; i++) {
                let sourcePeriod = periods[i];
                period.addSpend(sourcePeriod.spend);
                if (i === periods.length - 1) {
                    statement.balance = sourcePeriod.balance;
                }
            }
            statement.addPeriod(period);
        }
    }
})();