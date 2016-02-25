(function() {
    'use strict';

    angular.module('app').directive('isolateForm', IsolateForm);

    function IsolateForm() {
        return {
            restrict: 'A',
            require: '?form',
            link: link
        };

        function link (scope, element, attrs, controller) {
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
            angular.extend(controller, {
                $setDirty: function () {
                    element.removeClass('ng-pristine').addClass('ng-dirty');
                    controller.$dirty = true;
                    controller.$pristine = false;
                },
                $setValidity: function (validationToken, isValid, control) {
                    clone.$setValidity(validationToken, isValid, control);
                    parent.$setValidity(validationToken, true, controller);
                }
            });
        };
    }
})();