(function() {
    'use strict';

    angular.module('app').service('FormService', FormService);

    function FormService() {
        this.showError = function(element) {
            return element.$invalid && (element.$touched || element.$$parentForm.$submitted);
        }
        this.validate = function(form, validationGroup) {
            form.$setSubmitted();
            return form.$valid;
        }
    }
})();