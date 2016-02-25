(function() {
    'use strict';

    angular.module('app').directive('isolatedForm', IsolatedForm);

    function IsolatedForm() {
        return {
            restrict: 'A',
            require: '?form',
            link: function (scope, element, attrs, controller) {
                if (!controller) {
                    return;
                }

                let parent = element.parent().controller('form');
                if (!parent) {
                    return;
                }

                // remove parent link to the controller
                parent.$removeControl(controller);

                // clone the controller
                let clone = angular.copy(controller);

                // Replace form controller with an "isolated form"
                let isolatedFormController = {
                    $setValidity: function (validationToken, isValid, control) {
                        clone.$setValidity(validationToken, isValid, control);
                        parent.$setValidity(validationToken, true, controller);
                    },
                    $setDirty: function () {
                        element.removeClass('ng-pristine').addClass('ng-dirty');
                        controller.$dirty = true;
                        controller.$pristine = false;
                    }
                };
                angular.extend(controller, isolatedFormController);
            }
        };
    }
})();