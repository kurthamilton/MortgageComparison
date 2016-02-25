(function() {
    'use strict';

    angular.module('app').service('StorageService', () => new StorageService());

    class StorageService {
        get(key) {
            let data = window.localStorage.getItem(key);
            if (data !== undefined) {
                return angular.fromJson(data);
            }
            return null;
        }

        set(key, state) {
            if (state === undefined) {
                window.localStorage.removeItem(key);
                return false;
            }
            let data = angular.toJson(state);
            window.localStorage.setItem(key, data);
            return true;
        }
    }
})();