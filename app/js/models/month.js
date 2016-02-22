(function() {
    'use strict';

    angular.module('app').factory('Month', () => Month);

    class Month {
        constructor(index, startingBalance) {
            this.index = index;
            this.startingBalance = startingBalance;
            this.finishingBalance = startingBalance;
            this.payment = 0;
        }
    }
})();