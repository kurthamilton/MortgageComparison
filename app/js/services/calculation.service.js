(function() {
    'use strict';

    CalculationService.$inject = ['Month'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Month) {
        return {
            getStatement: function(balance, comparison, duration, monthlyPayment) {
                let months = [];
                let comparisonMonth = 0;
                let totalPayment = 0;

                for (let i = 0; i < comparison.mortgages.length; i++) {
                    let mortgage = comparison.mortgages[i];
                    let term = mortgage.term > 0 ? mortgage.term : duration - comparisonMonth;
                    for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                        let month = new Month(comparisonMonth, balance);
                        let payment = 0;

                        if (mortgageMonth === 0 && mortgage.fee !== undefined) {
                            if (mortgage.includeFee === true) {
                                balance += mortgage.fee;
                            } else {
                                payment = mortgage.fee;
                            }
                        }

                        balance += (balance * (mortgage.apr / 100 / 12));
                        balance -= monthlyPayment;
                        month.finishingBalance = balance;

                        payment += monthlyPayment;

                        totalPayment += payment;
                        month.totalPayment = totalPayment;

                        months.push(month);

                        if (comparisonMonth++ === duration) {
                            return months;
                        }
                    }
                }
                return months;
            }
        };
    }

})();