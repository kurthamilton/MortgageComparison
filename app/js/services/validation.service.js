(function() {
    'use strict';

    angular.module('app').service('ValidationService', () => new ValidationService());

    class ValidationService {
        cleanElementState(element) {
            element.$dirty = false;
            element.$pristine = true;
            element.$touched = false;
        }
        showError(element) {
            return element.$invalid && (element.$touched || element.$$parentForm.$submitted);
        }
        validate(form) {
            form.$setSubmitted();
            return form.$valid;
        }
    }
})();