(function() {
    'use strict';

    angular.module('app').service('FormService', FormService);

    function FormService() {
        this.showError = function(element) {
            return element.$touched && element.$invalid;
        }
    }
})();