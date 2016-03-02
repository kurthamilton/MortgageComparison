(function() {
    'use strict';

    angular.module('app').service('StorageService', () => new StorageService());

    function StorageService() {

    }

    StorageService.prototype.get = function(key) {
        let data = window.localStorage.getItem(key);
        if (data !== undefined) {
            return angular.fromJson(data);
        }
        return null;
    };

    StorageService.prototype.set = function(key, state) {
        if (state === undefined) {
            window.localStorage.removeItem(key);
            return false;
        }
        let data = angular.toJson(state);
        window.localStorage.setItem(key, data);
        return true;
    };
})();