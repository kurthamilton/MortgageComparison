(function() {
    'use strict';

    CalculationService.$inject = ['Statement', 'StatementPeriod'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Statement, StatementPeriod) {

        angular.extend(this, {
            getYearlyPayments: getYearlyPayments
        });

        function getMonthlyPayments(mortgage, balance, monthlyPayment) {
            let statement = new Statement(balance, mortgage.toString());

            // add 0-th period
            statement.addPeriod(new StatementPeriod(statement));

            // make payments until balance = 0
            while (statement.balance > 0) {
                // repeat mortgage cycle for its term, if it has one, otherwise exit when balance = 0
                let term = mortgage.term > 0 ? mortgage.term * 12 : Infinity;
                for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                    let period = new StatementPeriod(statement);
                    if (mortgageMonth === 0) {
                        // add fee and make lump sum overpayment at start of term
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
            addAggregatePeriod(statement, periods.splice(0, 1));
            while (periods.length > 0) {
                addAggregatePeriod(statement, periods.splice(0, numberOfMonths))
            }
            return statement;
        }

        function addAggregatePeriod(statement, periods) {
            if (!periods || periods.length === 0) {
                return;
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