(function() {
    'use strict';

    angular.module('app').service('ValidationService', () => new ValidationService());

    class ValidationService {
        showError(element) {
            return element.$invalid && (element.$touched || element.$$parentForm.$submitted);
        }
    }
})();