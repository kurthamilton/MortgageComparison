(function() {
    'use strict';

    angular.module('app').directive('formChange', FormChange);

    function FormChange($parse) {
       return {
            require: 'form',
            link: function(scope, element, attrs){
                let callback = $parse(attrs.formChange);
                element.on('change', function() {
                    callback(scope);
                });
            }
        };
    }
})();