(function() {
    'use strict';

    CalculationService.$inject = ['Month'];
    angular.module('app').service('CalculationService', CalculationService);

    function CalculationService(Month) {
        return {
            getStatement: function(balance, comparison, monthlyPayment) {
                let months = [];
                let comparisonMonth = 0;
                let totalSpend = 0;

                while (balance > 0) {
                    for (let i = 0; i < comparison.mortgages.length; i++) {
                        if (i === 0 && months.length > 0) {
                            // repeat last mortgage until balance = 0
                            i = comparison.mortgages.length - 1;
                        }

                        let mortgage = comparison.mortgages[i];
                        let monthlyRate = mortgage.apr / 100 / 12;
                        // repeat term-less mortgages until balance = 0
                        let term = mortgage.term > 0 ? mortgage.term : Infinity;
                        for (let mortgageMonth = 0; mortgageMonth < term; mortgageMonth++) {
                            let month = new Month(comparisonMonth++, balance);

                            if (mortgageMonth === 0 && mortgage.fee > 0) {
                                // add or spend fee at start of mortgage
                                if (mortgage.includeFee === true) {
                                    balance += mortgage.fee;
                                } else {
                                    totalSpend += mortgage.fee;
                                }
                            }

                            // add interest at start of month
                            balance += (balance * monthlyRate);

                            let monthPayment = monthlyPayment <= balance ? monthlyPayment : balance;

                            balance -= monthPayment;
                            month.finishingBalance = balance;

                            totalSpend += monthPayment;
                            month.totalSpend = totalSpend;

                            months.push(month);

                            if (balance === 0) {
                                return months;
                            }
                        }
                    }
                }

                return months;
            }
        };
    }

})();