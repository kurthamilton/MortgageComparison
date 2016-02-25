(function() {
    'use strict';

    angular.module('app').service('ValidationService', () => new ValidationService());

    class ValidationService {
        showError(element) {
            return element.$invalid && (element.$touched || element.$$parentForm.$submitted);
        }
        validate(form) {
            form.$setSubmitted();
            return form.$valid;
        }
    }

    function ValidationServiceX() {
        this.showError = function(element) {
            return element.$invalid && (element.$touched || element.$$parentForm.$submitted);
        }
        this.validate = function(form, validationGroup) {
            form.$setSubmitted();
            return form.$valid;
        }
    }
})();