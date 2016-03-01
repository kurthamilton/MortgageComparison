(function() {
    'use strict';

    angular.module('app').service('ValidationService', () => new ValidationService());

    class ValidationService {
        resetForm(form) {
            form.$setPristine();
            form.$setUntouched();
        }

        showError(element) {
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
        }

        submitForm (form) {
            form.$setSubmitted();
        }
    }
})();