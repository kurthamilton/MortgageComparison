(function() {
    'use strict';

    angular.module('app').factory('ChartData', () => ChartData);

    class ChartData {
        constructor() {
            this.labels = [];
            this.datasets = [];
            this.data = [];
            this.series = [];
        }

        addDataset(label, data) {
            this.datasets.push({
                label: label,
                data: data
            });
            this.series.push(label);
            this.data.push(data);
        }

        addLabel(label) {
            this.labels.push(label);
        }
    };
})();