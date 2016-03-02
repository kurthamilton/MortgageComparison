(function() {
    'use strict';

    angular.module('app').service('ValidationService', () => new ValidationService());

    function ValidationService() {
    }

    ValidationService.prototype.resetForm = function(form) {
        form.$setPristine();
        form.$setUntouched();
    };

    ValidationService.prototype.showError = function(element) {
        if (element.$invalid === false) {
            return false;
        }
        if (element.$touched === true) {
            return true;
        }

        let form = element.$$parentForm;
        while (form) {
            if (form.$submitted === true) {
                return true;
            }
            form = form.$$parentForm;
        };

        return false;
    };

    ValidationService.prototype.submitForm = function(form) {
        form.$setSubmitted();
    };
})();